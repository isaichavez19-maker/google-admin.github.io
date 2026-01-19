package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

type DecretoRequest struct {
	Prompt string `json:"prompt"`
}

type GeminiRequest struct {
	Contents []Content `json:"contents"`
}

type Content struct {
	Parts []Part `json:"parts"`
}

type Part struct {
	Text string `json:"text"`
}

func main() {
	apiKey := os.Getenv("DOMINUS_API_KEY")
	if apiKey == "" {
		log.Println("ADVERTENCIA: DOMINUS_API_KEY no establecida. El Oráculo estará mudo.")
	}

	http.HandleFunc("/api/decreto", func(w http.ResponseWriter, r *http.Request) {
		// CORS Headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		if r.Method != "POST" {
			http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
			return
		}

		var req DecretoRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Error decodificando JSON", http.StatusBadRequest)
			return
		}

		log.Printf("[SIDECAR] Procesando Decreto: %s", req.Prompt)

		// Preparar petición a Gemini
		geminiURL := "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey

		geminiReq := GeminiRequest{
			Contents: []Content{
				{
					Parts: []Part{
						{Text: req.Prompt},
					},
				},
			},
		}

		jsonData, _ := json.Marshal(geminiReq)

		resp, err := http.Post(geminiURL, "application/json", bytes.NewBuffer(jsonData))
		if err != nil {
			log.Printf("Error llamando a Gemini: %v", err)
			http.Error(w, "Error conectando con el Oráculo", http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()

		body, _ := io.ReadAll(resp.Body)

		// Respuesta directa
		w.Header().Set("Content-Type", "application/json")
		w.Write(body)

		// Simulación de Sincronización VST
		fmt.Println("[VST SYNC] Actualizando parámetros de audio basados en la respuesta...")
	})

	port := "8080"
	fmt.Printf(">>> SIDECAR DOMINUS ACTIVADO EN PUERTO %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
