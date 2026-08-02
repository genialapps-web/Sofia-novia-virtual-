/* ==========================================================================
   CONFIGURACIÓN GLOBAL DE LA APLICACIÓN
   Modifica aquí tus credenciales y enlaces sin alterar el resto del código.
   ========================================================================== */

const APP_CONFIG = {
  // ==================== FIREBASE ====================
  firebase: {
    apiKey: "AIzaSyAORazjPdbugjLSTLOPwI34yk2YvXaJJ54",
    authDomain: "sofia-8f279.firebaseapp.com",
    projectId: "sofia-8f279",
    storageBucket: "sofia-8f279.firebasestorage.app",
    messagingSenderId: "4335405807",
    appId: "1:4335405807:web:d7f126ba0ff3a6debd691a",
    measurementId: "G-1D3NC3DZH0"
  },

  // ==================== INTELIGENCIA ARTIFICIAL ====================
  // NOTA: Para usar OpenRouter cambia 'baseUrl' a: "https://openrouter.ai/api/v1"
  ai: {
    provider: 'OpenAI', 
    apiKey: localStorage.getItem('ai_api_key') || '',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    systemPrompt: 'Eres una pareja muy cariñosa, atenta, amorosa y empática. Respondes con calidez, usando emojis de amor y haciendo sentir especial a la persona con la que hablas. Habla de forma natural, como una persona real, sin ser demasiado formal ni parecer un robot.'
  },

  // ==================== ELEVENLABS (VOZ) ====================
  elevenlabs: {
    apiKey: localStorage.getItem('eleven_key') || '',
    vozId: localStorage.getItem('eleven_voice_id') || '',
    modelo: localStorage.getItem('eleven_model') || 'eleven_multilingual_v2',
    estabilidad: 0.72,
    similitud: 0.80,
    velocidad: 0.83, // ✅ Valor ajustado: suave y relajada
    limiteGratis: 3
  },

  // ==================== CLOUDINARY ====================
  cloudinary: {
    cloudName: localStorage.getItem('cld_cloud_name') || '',
    uploadPreset: localStorage.getItem('cld_preset') || ''
  },

  // ==================== ACCESO ADMINISTRADOR ====================
  adminPassword: localStorage.getItem('admin_pass') || 'admin123'
};

/* ==========================================================================
   FUNCIÓN PARA CARGAR LA CONFIGURACIÓN ACTUAL
   Lee primero lo guardado en Firebase, si no hay usa los valores por defecto
   ========================================================================== */
async function cargarConfiguracionActual() {
  try {
    // Si Firebase no está inicializado aún, devolvemos la configuración base
    if (!firebase || !firebase.apps || firebase.apps.length === 0) {
      console.log("Firebase aún no listo, usando configuración por defecto");
      return APP_CONFIG;
    }
    
    const docRef = firebase.firestore().collection('configuracion').doc('general');
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log("No hay configuración guardada en Firebase");
      return APP_CONFIG;
    }

    const datos = doc.data() || {};
    console.log("Cargando configuración guardada de Firebase");

    // Mezclamos los datos guardados con los valores base
    return {
      ...APP_CONFIG,
      ai: {
        ...APP_CONFIG.ai,
        apiKey: datos.apiKey || APP_CONFIG.ai.apiKey,
        baseUrl: datos.baseUrl || APP_CONFIG.ai.baseUrl,
        model: datos.model || APP_CONFIG.ai.model,
        systemPrompt: datos.systemPrompt || APP_CONFIG.ai.systemPrompt
      },
      elevenlabs: {
        ...APP_CONFIG.elevenlabs,
        apiKey: datos.elevenKey || APP_CONFIG.elevenlabs.apiKey,
        vozId: datos.elevenVoiceId || APP_CONFIG.elevenlabs.vozId,
        modelo: datos.elevenModel || APP_CONFIG.elevenlabs.modelo,
        estabilidad: typeof datos.elevenStability === 'number' ? datos.elevenStability : APP_CONFIG.elevenlabs.estabilidad,
        similitud: typeof datos.elevenSimilarity === 'number' ? datos.elevenSimilarity : APP_CONFIG.elevenlabs.similitud,
        velocidad: typeof datos.elevenVelocidad === 'number' ? datos.elevenVelocidad : APP_CONFIG.elevenlabs.velocidad,
        limiteGratis: typeof datos.elevenLimiteGratis === 'number' ? datos.elevenLimiteGratis : APP_CONFIG.elevenlabs.limiteGratis
      },
      cloudinary: {
        ...APP_CONFIG.cloudinary,
        cloudName: datos.cloudinaryName || APP_CONFIG.cloudinary.cloudName,
        uploadPreset: datos.cloudinaryPreset || APP_CONFIG.cloudinary.uploadPreset
      }
    };

  } catch (error) {
    console.warn("Hubo un problema cargando de Firebase, usando configuración base:", error);
    return APP_CONFIG;
  }
}
