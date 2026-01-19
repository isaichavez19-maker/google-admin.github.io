package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

// Estructura para el intercambio con el VST (Conceptual para C++ IPC)
type VSTPayload struct {
	Response string  `json:"response"`
	VNMIndex float64 `json:"vnm_index"`
}

var (
	ctx         = context.Background()
	client      *genai.Client
	model       *genai.GenerativeModel
	vstMutex    sync.Mutex
	lastPayload VSTPayload
)

func init() {
	// Protocolo de Seguridad: Absorción de la Llave desde el Sistema
	apiKey := os.Getenv("DOMINUS_API_KEY")
	if apiKey == "" {
		log.Println("WARNING: DOMINUS_API_KEY no encontrada. El Oráculo funcionará en modo degradado.")
	} else {
		var err error
		client, err = genai.NewClient(ctx, option.WithAPIKey(apiKey))
		if err != nil {
			log.Fatal(err)
		}

		model = client.GenerativeModel("gemini-2.5-flash-preview-09-2025")
		model.SystemInstruction = &genai.Content{
			Parts: []genai.Part{genai.Text("Eres el Oracle Core de Dominus Umbrea. Tu respuesta será inyectada en un motor de audio C++. Sé breve, técnico y esotérico.")},
		}
	}
}

// Handler para recibir decretos desde el Terminal Web (React)
func handleDecreto(w http.ResponseWriter, r *http.Request) {
	// Enable CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Prompt string `json:"prompt"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "JSON Malformado", http.StatusBadRequest)
		return
	}

	var oracleResponse string

	if model != nil {
		// Inferencia con Gemini
		resp, err := model.GenerateContent(ctx, genai.Text(req.Prompt))
		if err != nil {
			log.Printf("Error Gemini: %v", err)
			http.Error(w, "Fallo en el Oráculo", http.StatusInternalServerError)
			return
		}
		if len(resp.Candidates) > 0 && len(resp.Candidates[0].Content.Parts) > 0 {
			oracleResponse = fmt.Sprintf("%v", resp.Candidates[0].Content.Parts[0])
		} else {
			oracleResponse = "SILENCIO_DETECTADO."
		}
	} else {
		// Modo simulado si no hay API Key
		oracleResponse = "MODO_SIMULADO: EL ORÁCULO HA RECIBIDO TU DECRETO [" + req.Prompt + "]. SINTAXIS VÁLIDA."
	}

	// Actualizamos el estado compartido para que el VST lo lea
	vstMutex.Lock()
	lastPayload = VSTPayload{
		Response: oracleResponse,
		VNMIndex: 0.95, // VNM Establecido por éxito de inferencia
	}
	vstMutex.Unlock()

	// Respondemos al Terminal Web para confirmación visual
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(lastPayload)
}

// Endpoint que el VST C++ consulta (o vía Shared Memory/IPC)
func handleVSTSync(w http.ResponseWriter, r *http.Request) {
	vstMutex.Lock()
	defer vstMutex.Unlock()
	json.NewEncoder(w).Encode(lastPayload)
}

func main() {
	// Levantamos el Puente de Soberanía
	http.HandleFunc("/api/decreto", handleDecreto)
	http.HandleFunc("/vst/sync", handleVSTSync)

	fmt.Println(">>> SIDECAR GO: PUENTE DE SOBERANÍA ACTIVO EN PUERTO :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
