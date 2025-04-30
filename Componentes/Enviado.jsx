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
            <img src="/public/Poolso.jpg" alt="Logo" className="logo-img" />
          </div>
      </div> 

    
  );
};

export default Enviado;

