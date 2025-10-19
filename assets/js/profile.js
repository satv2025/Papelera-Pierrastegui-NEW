import { supabase } from "https://papelerapierrastegui.com.ar/assets/js/supabaseClient.js";

// React y ReactDOM desde CDN (no necesitas npm)
import "https://unpkg.com/react@18/umd/react.production.min.js";
import "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js";

(() => {
    const { useState, useEffect, useRef } = React;

    function ProfileApp() {
        const [user, setUser] = useState(null);
        const [nombre, setNombre] = useState("");
        const [usuario, setUsuario] = useState("");
        const [email, setEmail] = useState("");
        const [newPass, setNewPass] = useState("");
        const [showPass, setShowPass] = useState(false);
        const [msg, setMsg] = useState(null);
        const passRef = useRef(null);

        // 🔒 Cargar sesión
        useEffect(() => {
            (async () => {
                const { data } = await supabase.auth.getSession();
                const u = data?.session?.user;
                if (!u) return (window.location.href = "/login");
                setUser(u);
                setNombre(u.user_metadata?.nombre_completo || "");
                setUsuario(u.user_metadata?.username || "");
                setEmail(u.email);
            })();
        }, []);

        // 🎬 Animar el bloque de password con display:none real
        useEffect(() => {
            const el = passRef.current;
            if (!el) return;
            if (showPass) {
                el.style.display = "block";
                el.animate(
                    [
                        { opacity: 0, transform: "translateY(-10px)" },
                        { opacity: 1, transform: "translateY(0)" },
                    ],
                    { duration: 300, easing: "ease" }
                );
            } else {
                const anim = el.animate(
                    [
                        { opacity: 1, transform: "translateY(0)" },
                        { opacity: 0, transform: "translateY(-10px)" },
                    ],
                    { duration: 300, easing: "ease" }
                );
                anim.onfinish = () => (el.style.display = "none");
            }
        }, [showPass]);

        // 📣 Mensajes temporales
        const showMessage = (text, isError = false) => {
            setMsg({ text, color: isError ? "#ff3b30" : "#0fca8c" });
            setTimeout(() => setMsg(null), 3000);
        };

        // 💾 Guardar cambios perfil
        const handleSave = async (e) => {
            e.preventDefault();
            const { error } = await supabase.auth.updateUser({
                data: { nombre_completo: nombre, username: usuario },
            });
            showMessage(
                error
                    ? "❌ Error al actualizar el perfil ❌"
                    : "✔️ Perfil actualizado correctamente ✔️",
                !!error
            );
        };

        // 🔑 Cambiar contraseña
        const handleChangePass = async () => {
            if (!newPass.trim())
                return showMessage("❌ Ingresá una nueva contraseña ❌", true);

            const { error } = await supabase.auth.updateUser({ password: newPass });
            if (error)
                return showMessage("❌ Error al cambiar la contraseña ❌", true);

            showMessage("🔑 Contraseña actualizada correctamente 🔑");
            setShowPass(false);
            setNewPass("");
        };

        // 🚪 Cerrar sesión
        const handleLogout = async () => {
            await supabase.auth.signOut();
            window.location.href = "/";
        };

        if (!user) return React.createElement("div", null, "Cargando...");

        return React.createElement(
            "div",
            { className: "profile-container" },
            React.createElement(
                "div",
                { className: "profile-header" },
                React.createElement("div", { className: "profile-avatar" }, "👤"),
                React.createElement("h2", null, nombre || "Usuario Pierrastegui"),
                React.createElement("p", null, email)
            ),
            msg &&
            React.createElement(
                "div",
                {
                    id: "profile-message",
                    style: { color: msg.color, marginBottom: "1rem" },
                },
                msg.text
            ),
            React.createElement(
                "form",
                { id: "profile-form", onSubmit: handleSave },
                React.createElement(
                    "div",
                    { className: "profile-field" },
                    React.createElement("label", { htmlFor: "nombre" }, "Nombre completo"),
                    React.createElement("input", {
                        id: "nombre",
                        value: nombre,
                        onChange: (e) => setNombre(e.target.value),
                    })
                ),
                React.createElement(
                    "div",
                    { className: "profile-field" },
                    React.createElement("label", { htmlFor: "usuario" }, "Usuario"),
                    React.createElement("input", {
                        id: "usuario",
                        value: usuario,
                        onChange: (e) => setUsuario(e.target.value),
                    })
                ),
                React.createElement(
                    "div",
                    { className: "profile-field" },
                    React.createElement("label", { htmlFor: "email" }, "Correo electrónico"),
                    React.createElement("input", { id: "email", value: email, disabled: true })
                ),
                React.createElement(
                    "div",
                    { className: "profile-actions" },
                    React.createElement(
                        "button",
                        { type: "submit", className: "btn-guardar" },
                        "Guardar cambios"
                    ),
                    React.createElement(
                        "button",
                        {
                            type: "button",
                            className: "btn-password",
                            onClick: () => setShowPass((v) => !v),
                        },
                        showPass ? "Ocultar campo de contraseña" : "Cambiar contraseña"
                    ),
                    React.createElement(
                        "div",
                        {
                            id: "password-field",
                            ref: passRef,
                            className: "password-field",
                            style: { display: "none" },
                        },
                        React.createElement("input", {
                            type: "password",
                            id: "new-password",
                            placeholder: "Nueva contraseña",
                            value: newPass,
                            onChange: (e) => setNewPass(e.target.value),
                        }),
                        React.createElement(
                            "div",
                            { className: "password-buttons" },
                            React.createElement(
                                "button",
                                { type: "button", className: "btn-guardar", onClick: handleChangePass },
                                "Guardar contraseña"
                            ),
                            React.createElement(
                                "button",
                                {
                                    type: "button",
                                    className: "btn-salir",
                                    onClick: () => {
                                        setShowPass(false);
                                        setNewPass("");
                                    },
                                },
                                "Cancelar"
                            )
                        )
                    ),
                    React.createElement(
                        "button",
                        { type: "button", className: "btn-salir", onClick: handleLogout },
                        "Cerrar sesión"
                    )
                )
            )
        );
    }

    document.addEventListener("DOMContentLoaded", () => {
        const container = document.querySelector(".profile-container") || document.body;
        const root = ReactDOM.createRoot(container);
        root.render(React.createElement(ProfileApp));
    });
})();