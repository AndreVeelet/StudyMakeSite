/*const words = [
    "яблоко", "банан", "груша", "замечательный апельсин", "киви",
    "ананас", "персик", "слива", "вишня", "малина",
    "клубника", "замечательный арбуз", "дыня", "замечательный лимон", "замечательный грейпфрут",
    "черника", "ежевика", "манго", "папайя", "финик",
    "кактус", "перец", "морковь", "брокколи", "цветная капуста",
    "шпинат", "замечательный сельдерей", "лук", "чеснок", "имбирь",
    "базилик"
];
*/
let words = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('words.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Сеть не отвечает');
            }
            return response.text();
        })
        .then(data => {
            words = data.split('\n').filter(word => word.trim() !== '');
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось загрузить слова. Пожалуйста, проверьте файл words.txt.');
        });
});


const checkbox = document.getElementById('fullscreenCheckbox');

checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        // Включаем полноэкранный режим
        document.documentElement.requestFullscreen()
            .catch(err => {
                console.error(`Ошибка при попытке включить полноэкранный режим: ${err.message}`);
                checkbox.checked = false; // Сбрасываем чекбокс в случае ошибки
            });
    } else {
        // Выходим из полноэкранного режима
        document.exitFullscreen()
            .catch(err => {
                console.error(`Ошибка при попытке выйти из полноэкранного режима: ${err.message}`);
            });
    }
});

// Получаем элементы окон и кнопок
const window_settings = document.getElementById('window_settings');
const window_game = document.getElementById('window_game');
const window_result = document.getElementById('window_result');


const towindow_gameButton = document.getElementById('towindow_game');
const backTowindow_settingsButton = document.getElementById('backTowindow_settings');

// Функция для скрытия всех окон
function hideAllWindows() {
    window_settings.classList.remove('active');
    window_game.classList.remove('active');
    window_result.classList.remove('active');
}

// Переход к окну 2
towindow_gameButton.addEventListener('click', () => {
    hideAllWindows(); // Скрываем все окна
    window_game.classList.add('active'); // Показываем окно 2
    startGame();
});

// Переход обратно к окну 1
backTowindow_settingsButton.addEventListener('click', () => {
    hideAllWindows(); // Скрываем все окна
    window_settings.classList.add('active'); // Показываем окно 1
});

//ИГРА

let selectedWords = [];
let timeLimit = 10; 
let wordCount = 10; 
let bar;

wordCount = document.getElementById('wordCount').value;
timeLimit = document.getElementById('timeLimit').value;  
updateWordCount(wordCount); // Обновляем текст ползунка количества слов с текущим значением
updateTimeLimit(timeLimit);   // Обновляем текст ползунка времени с текущим значением

function updateWordCount(value) {
    document.querySelector('label[for="wordCount"]').textContent = `Количество слов (${value}):`;
}

function updateTimeLimit(value) {
    document.querySelector('label[for="timeLimit"]').textContent = `Время на запоминание (${value} сек):`;
}

function startGame() {
    if (words.length === 0) {
       alert('Слова еще не загружены. Пожалуйста, подождите.');
       return;
   }

   const overlay = document.getElementById('overlay');
   overlay.style.display = 'flex';
   
   hideAllWindows(); // Скрываем все окна
   
   const resultContainer = document.getElementById('result');
   resultContainer.innerHTML = '';
  
   wordCount = document.getElementById('wordCount').value;
   timeLimit = document.getElementById('timeLimit').value;
   
   selectedWords = selectRandomWords(words, wordCount);
   
   displayWords(selectedWords);

}

function selectRandomWords(words, count) {
   const shuffled = words.sort(() => 0.5 - Math.random());
   return shuffled.slice(0, count);
}

function displayWords(words) {
   let index = 0; 
   const wordDisplay = document.getElementById('wordDisplay');

   const interval = setInterval(() => {
       if (index >= words.length) {
           clearInterval(interval);
           wordDisplay.textContent = '';
           
           hideAllWindows(); // Скрываем все окна
           window_result.classList.add('active'); // Показываем окно 3
           document.getElementById('backTowindow_settings').style.display = 'none';
           startQuiz();
           return;
       }
       overlay.style.display = 'none';
       window_game.classList.add('active');
       document.getElementById('id_word').textContent = (index+1);
       wordDisplay.textContent = words[index];
       
       // Запуск анимации прогресс-бара
       startProgressBar()
       
       setTimeout(() => {
    
          index++;
       }, timeLimit * 1000); // Задержка на время запоминания
   }, timeLimit * 1000 + 500); // Общее время показа слова + небольшая задержка
}

// Переход к окну 3
function startProgressBar() {
    const progressBar = document.getElementById('progress');
    
    let width = 0;
    
    // Устанавливаем интервал для увеличения ширины прогресс-бара
    const interval = setInterval(() => {
        if (width >= 100) {clearInterval(interval); // Останавливаем интервал, когда прогресс завершен
        } else {
            width++; // Увеличиваем ширину прогресса
            progressBar.style.width = width + '%'; // Обновляем стиль прогресс-бара
        }
    }, timeLimit*10); // Интервал обновления (10 мс)
}

function startQuiz() {
   const quizContainer = document.getElementById('quiz');
   quizContainer.classList.remove('hidden'); // Показываем квиз
   
   let currentQuestionIndex = 0; // Индекс текущего вопроса
   let score = 0; // Счет правильных ответов
   const userAnswers = []; // Массив для хранения ответов пользователя

   function showQuestion() {
       if (currentQuestionIndex >= selectedWords.length) { // Если все вопросы заданы
           showResult(score, userAnswers); // Показать результат
           return;
       }

       const questionWord = selectedWords[currentQuestionIndex]; // Текущее слово для вопроса
       const options = generateOptions(questionWord); // Генерируем варианты ответов

       quizContainer.innerHTML = `<h2>Какое было слово ${currentQuestionIndex + 1}?</h2>`;
       //quizContainer.innerHTML.style = "display: flex; align-items: center;";

       options.forEach(option => { 
           const button = document.createElement('button'); 
           button.textContent = option; 
           button.classList.add('answer'); 
          
           button.style = "color: #222222;";

           button.onclick = () => { 
               userAnswers.push({ word: questionWord, answer: option }); 
               if (option === questionWord) score++; 
               currentQuestionIndex++; 
               showQuestion(); 
           }; 
           quizContainer.appendChild(button); 
       });
   }

  showQuestion(); // Показываем первый вопрос
}

function generateOptions(correctWord) {
  
  const incorrectWords = selectRandomWords(selectedWords.filter(word => (word !== correctWord)), 3); // Генерируем неправильные ответы
  const otherWord = selectRandomWords(words.filter(word => !selectedWords.includes(word)), 1);
  return [correctWord,otherWord, ...incorrectWords].sort(() => Math.random() - 0.5); // Возвращаем перемешанные варианты ответов
}

function showResult(score, userAnswers) {
  const quizContainer = document.getElementById('quiz');
  quizContainer.classList.add('hidden'); // Скрываем квиз

  document.getElementById('backTowindow_settings').style.display = 'block';

  const resultContainer = document.getElementById('result');
  resultContainer.classList.remove('hidden'); 

  resultContainer.innerHTML = `<h2>Результаты</h2><p>Вы угадали ${score} из ${selectedWords.length} слов.</p>`;
   
  const list = document.createElement('ol'); 

  userAnswers.forEach((answer, index) => { 
      const listItem = document.createElement('li'); 
      listItem.textContent = `${answer.answer}`; 
       
    if (answer.answer === answer.word) { 
          listItem.classList.add('correct'); 
        } else { 
          listItem.classList.add('incorrect'); 
          listItem.textContent += ` (верно: ${answer.word})`; 
        } 
    
      list.appendChild(listItem); 
    });

  resultContainer.appendChild(list); 

  updateWordCount(wordCount); // Обновляем текст ползунка количества слов с текущим значением
  updateTimeLimit(timeLimit);   // Обновляем текст ползунка времени с текущим значением

  resultContainer.innerHTML += ''; // Очищаем результаты предыдущего квиза после нажатия кнопки Старт.
}