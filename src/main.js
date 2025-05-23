import Swal from 'sweetalert2';

// Variables globales
let currentSubject = null;

let darkMode = false;

// Elementos del DOM
const elements = {
  welcomeScreen: document.getElementById('welcome-screen'),
  quizScreen: document.getElementById('quiz-screen'),
  resultScreen: document.getElementById('result-screen'),
  subjectList: document.getElementById('subject-list'),
  
  themeIcon: document.getElementById('theme-icon')
};

// Iconos por categoría
const categoryIcons = {
  'HTML': 'https://res.cloudinary.com/dowejnpvd/image/upload/v1748018383/html_zdnboy.png',
  'CSS': 'https://res.cloudinary.com/dowejnpvd/image/upload/v1748018382/css-3_yvevdl.png',
  'JavaScript': 'https://res.cloudinary.com/dowejnpvd/image/upload/v1748018382/js_adwar1.png',
  'Accessibility': 'https://res.cloudinary.com/dowejnpvd/image/upload/v1748018381/api_fh0fo1.png'
};

// Inicializar la aplicación
async function initApp() {
  await loadSubjects();
  setupEventListeners();
}

// Cargar temas desde la API (mock data por ahora)
async function loadSubjects() {
  try {
    // Simular carga de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockSubjects = [
      { title: 'HTML', icon: 'html' },
      { title: 'CSS', icon: 'css' },
      { title: 'JavaScript', icon: 'js' },
      { title: 'Accessibility', icon: 'accessibility' }
    ];

    renderSubjects(mockSubjects);
  } catch (error) {
    console.error('Error loading subjects:', error);
    showError('Failed to load quiz subjects. Please try again later.');
  }
}

// Renderizar la lista de temas
function renderSubjects(subjects) {
  elements.subjectList.innerHTML = subjects.map(subject => `
    <div class="subject-item card shadow-sm mb-3 p-3" data-subject="${subject.title}">
      <div class="d-flex align-items-center">
        <img src="${categoryIcons[subject.title]}" alt="${subject.title} icon" 
             class="subject-icon me-3 rounded p-2" style="background-color: var(--bs-primary-bg-subtle)">
        <span class="subject-name fs-5 fw-medium">${subject.title}</span>
        <i class="fas fa-chevron-right ms-auto text-muted"></i>
      </div>
    </div>
  `).join('');
}

// Configurar event listeners
function setupEventListeners() {
  // Selección de tema
  elements.subjectList.addEventListener('click', (e) => {
    const subjectItem = e.target.closest('.subject-item');
    if (subjectItem) {
      currentSubject = subjectItem.dataset.subject;
      startQuiz(currentSubject);
    }
  });




  // Cambiar tema claro/oscuro
  elements.themeIcon.addEventListener('click', toggleDarkMode);
}

// Iniciar el quiz (solo muestra alerta por ahora)
async function startQuiz(subject) {
  try {
    const { value: accept } = await Swal.fire({
      title: `Start ${subject} Quiz?`,
      text: "tienes 10 preguntas para responder.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Empezar cuestionario',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (accept) {
      // Aquí tus compañeros agregarán la lógica para mostrar quiz-screen
      Swal.fire({
        title: 'Empezando Cuestionario!',
        text: `El ${subject} cuestionario empezara ahora `,
        icon: 'success'
      });
    }
  } catch (error) {
    console.error('Error iniciando cuestionario:', error);
    showError('Por favor, intente de nuevo.');
  }
}

// Mostrar error con SweetAlert2
function showError(message) {
  Swal.fire({
    title: 'Error',
    text: message,
    icon: 'error'
  });
}

// Cambiar tema claro/oscuro
function toggleDarkMode() {
  darkMode = !darkMode;
  
  // Alternar clase dark-mode en el body
  document.body.classList.toggle('dark-mode', darkMode);
  
  // Cambiar icono
  elements.themeIcon.src = darkMode 
    ? 'https://res.cloudinary.com/dowejnpvd/image/upload/v1748017294/night-mode_zgyk66.png' 
    : 'https://res.cloudinary.com/dowejnpvd/image/upload/v1748017237/brightness_sldegk.png';
  
  // Guardar preferencia en localStorage
  localStorage.setItem('darkMode', darkMode);
}

// Verificar preferencia al cargar la página
function checkDarkModePreference() {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode !== null) {
    darkMode = savedMode === 'true';
    document.body.classList.toggle('dark-mode', darkMode);
    elements.themeIcon.src = darkMode 
      ? 'https://res.cloudinary.com/dowejnpvd/image/upload/v1748017294/night-mode_zgyk66.png'
      : 'https://res.cloudinary.com/dowejnpvd/image/upload/v1748017237/brightness_sldegk.png';
  }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', checkDarkModePreference);

// Iniciar la aplicación
document.addEventListener('DOMContentLoaded', initApp);