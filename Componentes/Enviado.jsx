import React from "react";
import "../src/Form.css";
import { FaCheckCircle } from "react-icons/fa";

const Enviado = () => {
  return (


     <div>  
        <h2 className="enviado-title">¡Formulario enviado correctamente!</h2>
        <p className="enviado-msg">Gracias por completar la ficha del empleado.</p>
        <p className="enviado-msg">Ya puedes cerrar esta página.</p>
        <div className="enviado-icon">
          <FaCheckCircle size={60} color="#01ab8b" />
        </div>
        <div className="submit-logo-container">
            <img src="https://prod-30.brazilsouth.logic.azure.com:443/workflows/145bc6b9b96a4bcd819e4e27983801c3/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=BjzmSFg5ZGJuV53vHMbHT22YSDpKqABGK9zmKWEJk4Q&path=/Poolso.jpg" alt="Logo" className="logo-img" />
          </div>
      </div> 

    
  );
};

export default Enviado;

