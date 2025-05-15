import React, { useEffect, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "./Form.css";
import Loader from "../Componentes/Loader";
import Enviado from "../Componentes/Enviado";

const Form = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [contractBlobUrl, setContractBlobUrl] = useState(null);
  const [anexoBlobUrl, setAnexoBlobUrl] = useState(null);
  const [error, setError] = useState(null);
  const [guid, setGuid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const urlGuid = new URLSearchParams(window.location.search).get("guid");
    if (!urlGuid) {
      setError("No se proporcionó un GUID en la URL.");
      return;
    }
    setGuid(urlGuid);

    const fetchUrl = `https://prod-15.brazilsouth.logic.azure.com:443/workflows/4576876bfdaa477abee064656eb846b8/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=nxOt3YuHoH84-dfi4FrPhgRd8-mYKzg3UjyO7wHdTMo&guid=${urlGuid}`;

    setIsLoading(true);
    fetch(fetchUrl)
      .then((res) => res.json())
      .then(({ Contrato, Anexo }) => {
        const processBase64 = (base64) => {
          const byteCharacters = atob(base64);
          const byteArrays = [];
          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
          }
          const blob = new Blob(byteArrays, { type: "application/pdf" });
          return URL.createObjectURL(blob);
        };

        if (Contrato && Contrato.startsWith("JVBER")) {
          setContractBlobUrl(processBase64(Contrato));
        }
        if (Anexo && Anexo.startsWith("JVBER")) {
          setAnexoBlobUrl(processBase64(Anexo));
        }
      })
      .catch((err) => {
        console.error("Error al cargar los PDFs:", err);
        setError("Ocurrió un error al cargar los documentos.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const sendDecision = async (decision) => {
    if (!guid) return;
    setIsLoading(true);

    const url = "https://prod-22.brazilsouth.logic.azure.com:443/workflows/cb8feb461cf645a48db8c060cdd6d84a/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Y7PF_WAIvsTjdN4cQGaYMSh2eyovVxOI5OEjJ6Drk7k&path=/submit_decision";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guid, estatus: decision }),
      });

      if (!res.ok) {
        throw new Error("No se pudo enviar la decisión");
      }

      setShowModal(true);
      setIsLoading(false);  // ✅ Apaga loader si todo salió bien

    } catch (err) {
      console.error("Error al enviar la decisión:", err);
      alert("Error al registrar la acción.");
      setIsLoading(false);  // ✅ Apaga loader si falló
    }
  };

  return (
    <div className="form-page">
      {isLoading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}

      <div className="form-box">
        {showModal ? (
          <Enviado />
        ) : (
          <>
            <h1 className="form-title">Contrato para firmar</h1>

            {error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : contractBlobUrl || anexoBlobUrl || error ? (
              <>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  {contractBlobUrl && (
                    <Viewer fileUrl={contractBlobUrl} plugins={[defaultLayoutPluginInstance]} />
                  )}
                  {anexoBlobUrl && (
                    <>
                      <h3>Anexo</h3>
                      <Viewer fileUrl={anexoBlobUrl} plugins={[defaultLayoutPluginInstance]} />
                    </>
                  )}
                </Worker>

                {!isLoading && (
                  <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
                    <button onClick={() => sendDecision("Aprobado")} className="btn btn-accept">
                      ✅ Firmar
                    </button>
                    <button onClick={() => sendDecision("Rechazado")} className="btn btn-reject">
                      ❌ Rechazar
                    </button>
                  </div>
                )}
              </>
            ) : (
              !isLoading && <p>Cargando documentos...</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Form;



