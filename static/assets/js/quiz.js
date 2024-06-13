// Elements
let submitButton = document.getElementById("submit-button");
let timerArray = document.querySelectorAll(".timer");
let timerCollection = [...timerArray]
let quizForm = document.getElementById("quiz-form");
let questions = document.querySelectorAll(".question");
let quizTimer = document.querySelector('#quiz-timer');
let timerSwitchValue = document.getElementById('timerSwitch_value').value
let quizChoiceFormatValue= document.getElementById('quizChoiceFormat_value').value;
let quizQuestionFormatValue= document.getElementById('quizQuestionFormat_value').value;
let answeringFormatValue= document.getElementById('answeringFormat_value').value;

let options = document.querySelectorAll(".form-check-input");
let optionsArray = [...options];

let userScoreInput = $('#user-score');

quizDuration = quizTimer.value * 60;
// quizDuration = 20;
const initialTime = quizDuration;



let allChoiceLetters = document.querySelectorAll('.choice-letter');
for(let i = 0; i < allChoiceLetters.length; i++){
    let choiceValue = allChoiceLetters[i].dataset.letter
    choiceValue ==  1 ? allChoiceLetters[i].textContent = 'A' : choiceValue == 2 ? allChoiceLetters[i].textContent = 'B' : choiceValue == 3 ? allChoiceLetters[i].textContent = 'C' : allChoiceLetters[i].textContent ='D'
}

// fixed timer





// // back to top button with progress bar
let calcScrollValue = () =>{
	let scrollProgress = document.getElementById("progress");
	let pos = document.documentElement.scrollTop;
	let calcHeight  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
	let scrollValue = Math.round((pos * 100) / calcHeight);
	if(pos > 100){
		scrollProgress.style.display = 'grid';
	}
	else{
		scrollProgress.style.display = 'none';
	}
scrollProgress.addEventListener('click', function(){
	document.documentElement.scrollTop = 0;
});
scrollProgress.style.background = `conic-gradient(#2c4bff ${scrollValue}%, #d7d7d7 ${scrollValue + 2}%)`
}
window.onscroll = calcScrollValue;
window.onload = calcScrollValue;

// back to top button with progress bar
let calcTimerValue = () => {
    let timerProgress = document.getElementById("timer-progress");
    let timerProgressValue = Math.round((quizDuration / initialTime) * 100);
    const timerContainer = document.getElementById('timer-container');

    let observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                timerProgress.style.display = 'none';
            } else {
                timerProgress.style.display = 'grid';
            }
        });
    }, { threshold: 0 });

    observer.observe(timerContainer);

    timerProgress.style.background = `conic-gradient(#2c4bff ${timerProgressValue}%, #d7d7d7 ${0}%)`;
};




var modal = document.getElementById("myModal");

// Get the button that opens the modal

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];



// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}





// Check right answer and then calculate the score
function calculateScore() {
    let score = 0;
    let totalQuestions = 0;
    // Loop through each question
    questions.forEach(question => {
        let selectedInput = question.querySelector('input:checked');
        let correctAnswer = question.querySelector(".correct-answer").innerHTML;
        totalQuestions += 1;
        // Check if the answer is correct or not
        if (selectedInput && selectedInput.value === correctAnswer) {
            score += 1;
        }
    });

    // Update the hidden input field with score in form
    userScoreInput.value = score;
    // console.log(score)
    displayScore(score,totalQuestions);

}

function displayScore (score, totalQuestions){
    let scorePercentage = Math.round((score *100)/totalQuestions);
    let timerPercentage = Math.round(100 - ((quizDuration/initialTime )* 100));

    let scoreText = document.querySelectorAll('.score');
    scoreText.forEach( el =>{
        el.innerHTML = `You got <span class="score-number">${score}/${totalQuestions}</span> questions right scoring <span class="score-number">${scorePercentage}/100</span>`; 
    })    

    //circular progress bar
document.querySelectorAll(".circular-progress").forEach((circularProgress, index) => {
    let progressValue = document.querySelectorAll(".progress-value")[index];

    let progressStartValue = 0;
    
    let progressEndValues = [scorePercentage, timerPercentage];
    let progressEndValue = progressEndValues[index];
    
    let speed = 20;

    if (progressStartValue != progressEndValue) {
        
        let progress = setInterval(() => {
            progressStartValue++;
            
            if(index != 1){
            progressValue.textContent = `${progressStartValue}%`;
            circularProgress.style.background = `conic-gradient(#2c4bff ${progressStartValue * 3.6}deg, #ededed 0deg)`;
        }else{
            circularProgress.style.background = `conic-gradient(#ededed ${progressStartValue * 3.6}deg, #2c4bff 0deg)`;

        }
            if (progressStartValue == progressEndValue) {
                clearInterval(progress);
            }
        }, speed);
    }
});

}


function highlightAnswersandExplanation() {
    questions.forEach(question => {
        
        // highlight correct answer while showing result

        let correctAnswer = question.querySelector(".correct-answer");
        let correctAnswerLetter = correctAnswer.previousElementSibling.querySelector(".choice-letter");
        let correctAnswerInput = correctAnswer.previousElementSibling.querySelector('.form-check-input')
        
        // console.log(correctAnswerLetter)
        // correctAnswer.previousElementSibling.querySelector("input").classList.add("bg-success");
        // correctAnswer.previousElementSibling.classList.add("fw-bold");
        
        // add x icon and ✅ to the answer
        correctAnswerLetter.innerHTML = '<svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M20 7L10 17l-5-5"/></svg>'
        correctAnswerInput.style.background = '#00A60E'
        correctAnswerInput.style.borderColor = '#00A60E'
        // explanationContainer.style.background = '#198754'
        
        
        

        
        let selectedAnswer = question.querySelector("input[type='radio']:checked");

        if(selectedAnswer != null){

        
            let selectedLetter = selectedAnswer.parentNode.querySelector('.choice-letter');
         if(correctAnswer.textContent != selectedAnswer.value){                
                
                selectedLetter.innerHTML = '<svg class="dash-icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="#fff" fill-rule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8" clip-rule="evenodd"/></svg>'
                selectedAnswer.style.background = '#2c4bff'
                selectedAnswer.style.borderColor = '#2c4bff'
                // explanationContainer.style.background = '#2c4bff'
            }
            
        }
       
      
        
        //show explanation to each question while showing result
        let explanation = question.querySelector(".explanation");
        explanation.classList.remove('hidden');
    
    });

    // disable submit button
    submitButton.disabled = true;
    let options = document.querySelectorAll(".form-check-input")
    // disable all options
    options.forEach(option => {
        option.disabled = true;
    });
}


function submitQuiz(){
    // calculate the user's score
    calculateScore();
    // highlight the answers and explanation
    highlightAnswersandExplanation();
    clearTimeout(quizTimerId);
    //send ajax request to send score
    $.ajax({
        type: "POST",
        url: '',
        data: {
         score : userScoreInput.value,
         csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(data){

        },
        error: function(){
            console.error('Ajax request error, can\'t send score to user')
        }
        
        
    })
  modal.style.display = "block";
  

}
// Attach Event Listener to Submit button

$(document).on("submit", "#quiz-form", function(e){
    e.preventDefault()

    submitQuiz()

  
})

// quizForm.addEventListener('submit', function(e){
//     e.preventDefault();
//     submitQuiz()
// });

// Update Timer
function updateTimer() {
    if(timerSwitchValue == "False" || timerSwitchValue == "false" || timerSwitchValue == false) return;
    let minutes = Math.floor(quizDuration / 60);
    let seconds = quizDuration % 60;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    timerCollection.forEach(timerSpan => {
        timerSpan.innerText = `${formattedMinutes}:${formattedSeconds}`;
    })
    calcTimerValue()

    // Check if the time ended
    if (quizDuration <= 0) {
        // Automatically Submit the quiz
        clearTimeout(quizTimerId);
        submitQuiz();
        
    } else {
        // decrement the timer value by 1s
        quizDuration--;
    }
    
}
// Timer Interval
quizTimerId = setInterval(updateTimer, 1000);


if(answeringFormatValue == "Immediately"){

    let allChoices = document.querySelectorAll('.form-check-input');
    allChoices.forEach(choice => choice.addEventListener('click', submitAnswersImmediately)) 
// to see the answers right away after choosing.
function submitAnswersImmediately() {
    
        optionsArray.filter(option =>{
    // check if there is a selected option by the user on the quiz
        if (option.checked){
            // get the specific question where the student selected option
            let question = option.parentElement.parentElement.parentElement.parentElement
            
            //reveal the correct answer for the answered question and add styling to it.
            
            let correctAnswer = question.querySelector(".correct-answer");
            let correctAnswerLetter = correctAnswer.previousElementSibling.querySelector(".choice-letter");
            let correctAnswerInput = correctAnswer.previousElementSibling.querySelector('.form-check-input')
            // correctAnswer.previousElementSibling.classList.add("fw-bold");
           
            correctAnswerLetter.innerHTML = '<svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M20 7L10 17l-5-5"/></svg>'
        correctAnswerInput.style.background = '#00A60E'
        correctAnswerInput.style.borderColor = '#00A60E'

        let selectedAnswer = question.querySelector("input[type='radio']:checked");

        if(selectedAnswer != null){

        
            let selectedLetter = selectedAnswer.parentNode.querySelector('.choice-letter');
         if(correctAnswer.textContent != selectedAnswer.value){                
                
                selectedLetter.innerHTML = '<svg class="dash-icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="#fff" fill-rule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8" clip-rule="evenodd"/></svg>'
                selectedAnswer.style.background = '#2c4bff'
                selectedAnswer.style.borderColor = '#2c4bff'
                // explanationContainer.style.background = '#2c4bff'
            }
        }
        
            //show explanation for the answered question 
            let explanation = question.querySelector(".explanation");
            explanation.classList.remove('hidden');
            let questionOptions = question.querySelectorAll('.form-check-input');
            //disable all choices for the answered question
            questionOptions.forEach(option => option.disabled = true)

        }
    })

}
}

