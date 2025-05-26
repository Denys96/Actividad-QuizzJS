import Swal from 'sweetalert2';
import { quizData } from './todo-quiz'; // Aquí tienes tus preguntas de HTML, CSS y JS juntas
import { cssQuizData } from './cssQuiz'
import { jsQuizData } from './jsQuiz'
import { htmlQuizData } from './htmlQuiz'

// Variables globales
let currentSubject = null; // Tema actual del cuestionario
let darkMode = false;      // Estado del modo oscuro
let currentQuestionIndex = 0; // Índice de pregunta actual
let score = { value: 0 };     // Puntaje actual

// Elementos del DOM
const elements = {
  welcomeScreen: document.getElementById('welcome-screen'), // Pantalla de bienvenida
  quizScreen: document.getElementById('quiz-screen'),       // Pantalla del cuestionario
  resultScreen: document.getElementById('result-screen'),   // Pantalla de resultados
  subjectList: document.getElementById('subject-list'),     // Lista de temas disponibles
  themeIcon: document.getElementById('theme-icon')          // Icono para cambiar tema
};

// Iconos para cada categoría
const categoryIcons = {
  'html': 'https://res.cloudinary.com/dowejnpvd/image/upload/v1748018383/html_zdnboy.png',
  'css': 'https://res.cloudinary.com/dowejnpvd/image/upload/v1748018382/css-3_yvevdl.png',
  'js': 'https://res.cloudinary.com/dowejnpvd/image/upload/v1748018382/js_adwar1.png',
  'Todo': 'https://res.cloudinary.com/dust9ohqt/image/upload/v1748044221/todo-uno_pitciq.png'
};

// Función que muestra cada pregunta en pantalla
function renderQuestion(elements, currentQuestionIndex, score, callbackShowResults, questions) {
  const questionData = questions[currentQuestionIndex]; // Pregunta actual

  const quizHTML = `
    <div class="card p-4 shadow-lg border-0 rounded-4 bg-light">
      <h4 class="mb-3">Pregunta ${questionData.number} de ${questions.length}</h4>
      <p class="fs-5 fw-semibold">${questionData.question}</p>
      <div id="options-container" class="d-flex flex-column gap-3 mb-3">
        ${questionData.options.map((opt, idx) => `
          <div class="option-card card p-3 shadow-sm border-0 rounded-3 hover-scale" data-index="${idx}" style="cursor:pointer; transition: all 0.2s;">
            ${opt}
          </div>
        `).join('')}
      </div>
      <button id="next-btn" class="btn btn-primary btn-sm px-4 py-2 rounded-pill mt-3" style="width: auto;" disabled>Siguiente</button>
    </div>
  `;

  elements.quizScreen.innerHTML = quizHTML;

  const optionCards = elements.quizScreen.querySelectorAll('.option-card');
  const nextBtn = document.getElementById('next-btn');
  let selectedIndex = null;

  // Cuando el usuario selecciona una opción
  optionCards.forEach(card => {
    card.addEventListener('click', () => {
      optionCards.forEach(c => c.classList.remove('selected', 'border-primary'));
      card.classList.add('selected', 'border', 'border-primary');
      selectedIndex = parseInt(card.dataset.index);
      nextBtn.disabled = false;
    });
  });

  // Cuando el usuario hace clic en "Siguiente"
  nextBtn.addEventListener('click', () => {
    if (selectedIndex === null) return;

    if (selectedIndex === questionData.correct) {
      score.value++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      renderQuestion(elements, currentQuestionIndex, score, callbackShowResults, questions);
    } else {
      callbackShowResults(score.value, questions.length);
    }
  });
}

// Función que muestra la pantalla de resultados
function showResults(elements, scoreValue, totalQuestions) {
  elements.quizScreen.classList.add('d-none');     // Oculta preguntas
  elements.resultScreen.classList.remove('d-none'); // Muestra resultados

  // Aquí mostramos el puntaje final y el botón "Volver al inicio"
  elements.resultScreen.innerHTML = `
    <div class="card p-4 text-center shadow-lg bg-light border-0 rounded-4">
      <h2 class="mb-3">¡Completaste el cuestionario!</h2>
      <p class="fs-4">Obtuviste <strong>${scoreValue}</strong> de <strong>${totalQuestions}</strong> preguntas correctas.</p>
      
      <!-- Contenedor centrado para el botón -->
      <div class="d-flex justify-content-center">
        <button class="btn btn-success btn-sm px-4 py-2 rounded-pill mt-4" id="restart-btn">
          Volver al inicio
        </button>
      </div>
    </div>
  `;

  // Al hacer clic en el botón, volvemos a la pantalla de bienvenida
  document.getElementById('restart-btn').addEventListener('click', () => {
    elements.resultScreen.classList.add('d-none');
    elements.welcomeScreen.classList.remove('d-none');
  });
}

// Inicializar la app (espera a que se cargue todo)
async function initApp() {
  await loadSubjects();
  setupEventListeners();
}

// Cargar lista de temas (simulada con datos ficticios)
async function loadSubjects() {
  try {
    await new Promise(resolve => setTimeout(resolve, 500)); // Espera simulada

    const mockSubjects = [
      { title: 'HTML', icon: 'html' },
      { title: 'CSS', icon: 'css' },
      { title: 'JavaScript', icon: 'js' },
      { title: 'HTML, CSS y JS', icon: 'Todo' }
    ];

    renderSubjects(mockSubjects);
  } catch (error) {
    console.error('Error loading subjects:', error);
    showError('No se pudieron cargar los temas del cuestionario.');
  }
}

// Mostrar los temas disponibles
function renderSubjects(subjects) {
  elements.subjectList.innerHTML = subjects.map(subject => `
    <div class="subject-item card shadow-sm mb-3 p-3" data-subject="${subject.title}">
      <div class="d-flex align-items-center">
        <img src="${categoryIcons[subject.icon]}" alt="${subject.icon} icon" 
            class="subject-icon me-3 rounded p-2" style="background-color: var(--bs-primary-bg-subtle)">
        <span class="subject-name fs-5 fw-medium">${subject.title}</span>
        <i class="fas fa-chevron-right ms-auto text-muted"></i>
      </div>
    </div>
  `).join('');
}

// Eventos del usuario
function setupEventListeners() {
  // Cuando el usuario elige un tema
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

// Iniciar el cuestionario según el tema seleccionado
async function startQuiz(subject) {
  try {
    const { value: accept } = await Swal.fire({
      title: `¿Quieres iniciar el quiz de ${subject}?`,
      text: "Tienes 10 preguntas para responder.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Empezar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

if (accept) {
    // 🚧 Manejo de los diferentes cuestionarios
    if (["HTML, CSS y JS", "HTML", "CSS", "JavaScript"].includes(subject)) {
        elements.welcomeScreen.classList.add('d-none');
        elements.resultScreen.classList.add('d-none');
        elements.quizScreen.classList.remove('d-none');

        currentQuestionIndex = 0;
        score = { value: 0 };

        let questions;

        // Seleccionar el conjunto de preguntas según el tema elegido
        switch (subject) {
            case "HTML, CSS y JS":
                questions = [...quizData];
                break;
            case "HTML":
                questions = [...htmlQuizData];
                break;
            case "CSS":
                questions = [...cssQuizData];
                break;
            case "JavaScript":
                questions = [...jsQuizData];
                break;
        }

        renderQuestion(
            elements,
            currentQuestionIndex,
            score,
            (finalScore, total) => showResults(elements, finalScore, total),
            questions
        );

    } else {
        Swal.fire({
            title: 'En construcción',
            text: `El cuestionario de ${subject} aún no está disponible.`,
            icon: 'info'
        });
    }
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

// Activar/desactivar modo oscuro
function toggleDarkMode() {
  darkMode = !darkMode;

  document.body.classList.toggle('dark-mode', darkMode);

  elements.themeIcon.src = darkMode
    ? 'https://res.cloudinary.com/dowejnpvd/image/upload/v1748017294/night-mode_zgyk66.png'
    : 'https://res.cloudinary.com/dowejnpvd/image/upload/v1748017237/brightness_sldegk.png';

  localStorage.setItem('darkMode', darkMode);
}

// Revisar si el usuario ya tenía modo oscuro activado
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

// Espera que todo el documento cargue antes de iniciar
document.addEventListener('DOMContentLoaded', () => {
  checkDarkModePreference();
  initApp();
});
