import { Link } from "react-router-dom";
import "../styles.css";

export default function Home() {
    return (
        <div className="container">
            <h1>Simoldes PCP</h1>
            <p>Bem-Vindo!</p>
            <div className="buttons">
                <Link to="/login" className="btn">Login</Link>
                <Link to="/register" className="btn">Cadastrar</Link>
            </div>
        </div>
    );
}