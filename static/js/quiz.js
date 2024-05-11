    // Elements
    let submitButton = document.getElementById("submit-button");
    let timerSpan = document.getElementById("timer");
    let quizForm = document.getElementById("quiz-form");
    let questions = document.querySelectorAll(".question");
    let quizTimer = document.querySelector('#quiz-timer');
    // let options = document.querySelectorAll(".form-check-input");
    // let optionsArray = [...options];

    let userScoreInput = $('#user-score');

    quizDuration = quizTimer.value;
    // quizDuration = 13;
    
    

    // Check right answer and then calculate the score
    function calculateScore() {
        let score = 0;
        let totalQuestions = 0;
        // Loop through each question
        questions.forEach(question => {
            let selectedInput = question.querySelector('input:checked');
            let correctAnswer = question.querySelector(".correct-answer").innerText;
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
    let scoreText = document.querySelector('#score');
    scoreText. textContent = `You got ${score} out of ${totalQuestions}`;
   }

    function highlightAnswersandExplanation() {
        questions.forEach(question => {
            
            // highlight correct answer while showing result
            let correctAnswer = question.querySelector(".correct-answer");
            correctAnswer.previousElementSibling.querySelector("input").classList.add("bg-success");
            correctAnswer.previousElementSibling.classList.add("fw-bold");
        
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

        let minutes = Math.floor(quizDuration / 60);
        let seconds = quizDuration % 60;
        timerSpan.innerText = `${minutes}:${seconds}`;

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
    

    // let allChoices = document.querySelectorAll('.form-check-input');
    // allChoices.forEach(choice => choice.addEventListener('click', submitAnswersImmediately)) 
    
    // to see the answers right away after choosing.
//    function submitAnswersImmediately() {
       
//     optionsArray.filter(option =>{
//     // check if there is a selected option by the user on the quiz
//         if (option.checked){
//             // get the specific question where the student selected option
//                let question = option.parentElement.parentElement.parentElement.parentElement

//                //reveal the correct answer for the answered question and add styling to it.
//                let correctAnswer = question.querySelector(".correct-answer");
//             correctAnswer.previousElementSibling.querySelector("input").classList.add("bg-success");
//             correctAnswer.previousElementSibling.classList.add("fw-bold");
        
//             //show explanation for the answered question 
//             let explanation = question.querySelector(".explanation");
//             explanation.classList.remove('hidden');
//             let questionOptions = question.querySelectorAll('.form-check-input');
//             //disable all choices for the answered question
//             questionOptions.forEach(option => option.disabled = true)
        
//         }
//     })
 
// }
    