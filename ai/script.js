document.getElementById('startButton').addEventListener('click', startGame);

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
	
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = '';

    wordCount = document.getElementById('wordCount').value;
    timeLimit = document.getElementById('timeLimit').value;
	
    selectedWords = selectRandomWords(words, wordCount);
    
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('wordCount').style.display = 'none';
    document.getElementById('timeLimit').style.display = 'none';

    const overlay = document.getElementById('overlay');
    overlay.style.display = 'flex';

    displayWords(selectedWords);

}

function selectRandomWords(words, count) {
    const shuffled = words.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function displayWords(words) {
    let index = 0; 
    const wordDisplay = document.getElementById('wordDisplay');
 
 // Инициализация прогресс-бара

    if (!bar) 
		{ bar = new ProgressBar.Line('#progressContainer', { 
			strokeWidth: 4,
			easing: 'easeInOut',
			duration: timeLimit * 1000,
			color: '#4caf50',
			trailColor: '#f3f3f3',
			trailWidth: 4,
			svgStyle: { width: '100%', height: '10px' },
			text: { style: { color: '#999', position: 'absolute', right: '0', top: '30px', padding:'0', margin:'0', transform:'translate(-100%, -100%)' } },
			from: { color:'#ff0000' },
			to: { color:'#4caf50' },
			step(state, bar) {
				bar.setText(Math.round(bar.value() * 100) + '%');
			}
		})
	};
	document.getElementById('progressContainer').style.display = 'none';
	
    const interval = setInterval(() => {
        if (index >= words.length) {
            clearInterval(interval);
            wordDisplay.textContent = '';
            
			document.getElementById('progressContainer').style.display = 'none';
			startQuiz();
            return;
        }
		overlay.style.display = 'none';
		document.getElementById('progressContainer').style.display = 'block';
        wordDisplay.textContent = (index+1) + ": " + words[index];
        
        // Запуск анимации прогресс-бара
       bar.animate(1); // Значение от 0 до 1
        
        setTimeout(() => {
            bar.set(0); // Сбрасываем прогресс-бар перед следующим словом
            index++;
        }, timeLimit * 1000); // Задержка на время запоминания
    }, timeLimit * 1000 + 500); // Общее время показа слова + небольшая задержка
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
        
        options.forEach(option => { 
            const button = document.createElement('button'); 
            button.textContent = option; 
            button.classList.add('answer'); 
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
   const otherWord = selectRandomWords(words.filter(word => word !== correctWord), 1);
   const incorrectWords = selectRandomWords(selectedWords.filter(word => (word !== correctWord)&(word !== otherWord)), 3); // Генерируем неправильные ответы
   return [correctWord,otherWord, ...incorrectWords].sort(() => Math.random() - 0.5); // Возвращаем перемешанные варианты ответов
}

function showResult(score, userAnswers) {
   const quizContainer = document.getElementById('quiz');
   quizContainer.classList.add('hidden'); // Скрываем квиз

   const resultContainer = document.getElementById('result');
   resultContainer.classList.remove('hidden'); 

   resultContainer.innerHTML = `<h2>Результат теста:</h2><p>Вы угадали ${score} из ${selectedWords.length} слов.</p>`;
    
   const list = document.createElement('ol'); 

   userAnswers.forEach((answer, index) => { 
       const listItem = document.createElement('li'); 
       listItem.textContent = `Слово ${index + 1}: ${answer.word}`; 
        
       if (answer.answer === answer.word) { 
           listItem.classList.add('correct'); 
       } else { 
           listItem.classList.add('incorrect'); 
           listItem.textContent += ` (Ваш ответ: ${answer.answer})`; 
       } 
        
       list.appendChild(listItem); 
   });

   resultContainer.appendChild(list); 

   document.getElementById('startButton').style.display = 'block'; // Показываем кнопку Старт снова
   document.getElementById('wordCount').style.display = 'block'; // Показываем ползунок количества слов снова
   document.getElementById('timeLimit').style.display = 'block'; // Показываем ползунок времени снова

   updateWordCount(wordCount); // Обновляем текст ползунка количества слов с текущим значением
   updateTimeLimit(timeLimit);   // Обновляем текст ползунка времени с текущим значением

   resultContainer.innerHTML += ''; // Очищаем результаты предыдущего квиза после нажатия кнопки Старт.
}