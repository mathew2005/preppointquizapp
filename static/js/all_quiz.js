let informationContainerAll = document.querySelectorAll('.quiz-information-container');
informationContainerAll.forEach((el) =>{
    let scoreInput = el.querySelector('.score-value');
    if (scoreInput){
        let progressValueContainer = el.querySelector('.score-progress-value');
        let totalQuestionsValue = el.querySelector('.total-questions').value;
        let scoreValue = scoreInput.value;
        let scorePercentage = Math.round((scoreValue/totalQuestionsValue) * 100);
         progressValueContainer.style.width = scorePercentage + '%';
         
    }

})