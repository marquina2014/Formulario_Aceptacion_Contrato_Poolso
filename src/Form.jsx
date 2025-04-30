import React, { useEffect, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "./Form.css";

const Form = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [error, setError] = useState(null);
  const [guid, setGuid] = useState("");

  useEffect(() => {
    const urlGuid = new URLSearchParams(window.location.search).get("guid");
    if (!urlGuid) {
      setError("No se proporcionó un GUID en la URL.");
      return;
    }
    setGuid(urlGuid);

    const fetchUrl = `https://prod-15.brazilsouth.logic.azure.com:443/workflows/4576876bfdaa477abee064656eb846b8/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=nxOt3YuHoH84-dfi4FrPhgRd8-mYKzg3UjyO7wHdTMo&guid=${urlGuid}`;

    fetch(fetchUrl)
      .then((res) => res.text())
      .then((base64) => {
        if (!base64 || !base64.startsWith("JVBER")) {
          throw new Error("El contenido no parece ser un PDF válido.");
        }

        const byteCharacters = atob(base64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(blobUrl);
      })
      .catch((err) => {
        console.error("Error al cargar el PDF:", err);
        setError("Ocurrió un error al cargar el contrato.");
      });
  }, []);

  const sendDecision = async (decision) => {
    if (!guid) return;

    const url = "https://prod-22.brazilsouth.logic.azure.com:443/workflows/cb8feb461cf645a48db8c060cdd6d84a/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Y7PF_WAIvsTjdN4cQGaYMSh2eyovVxOI5OEjJ6Drk7k";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guid, estatus: decision }),
      });

      if (res.ok) {
        alert(`Contrato ${decision === "Aprobado" ? "aceptado" : "rechazado"}`);
      } else {
        throw new Error("No se pudo enviar la decisión");
      }
    } catch (err) {
      console.error("Error al enviar la decisión:", err);
      alert("Error al registrar la acción.");
    }
  };

  return (
    <div className="form-page">
      <div className="form-box">
        <h1 className="form-title">Contrato para firmar</h1>

        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : pdfBlobUrl ? (
          <>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer fileUrl={pdfBlobUrl} plugins={[defaultLayoutPluginInstance]} />
            </Worker>

            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button onClick={() => sendDecision("Aprobado")} className="btn btn-accept">
                ✅ Firmar
              </button>
              <button onClick={() => sendDecision("Rechazado")} className="btn btn-reject">
                ❌ Rechazar
              </button>
            </div>
          </>
        ) : (
          <p>Cargando documento...</p>
        )}
      </div>
    </div>
  );
};

export default Form;
