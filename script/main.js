let loader = document.getElementById("loader");
const cards = [
    {
        id:1,
        teaName:"الوزة",
        image:'./images/alwazah.png',
        suger_amount: (amountWaterParameter)=>{
            return (parseFloat(amountWaterParameter) * 52) / 1000
        },
        tea_amount: (amountWaterParameter)=>{
            return (parseFloat(amountWaterParameter) * 16.4) / 1000
        },
        teaType: "ورق ( تلقيمة )",
        teaMixture:"",
        howToPrepare:['يضاف السكر مع الماء على النار إلى أن تصل لدرجة الغليان','نضع أوراق الشاي','نضع الغطاء القماشي','نتركه يخدر 10 دقائق','بعد ال10 دقائق نصفّي الشاي من الورق'],
        teaInWaterTime:"خدرة سريعة",
    },
    {
        id:2,
        teaName:"شاهي الأولين",
        image:'./images/شاهي الاولين.webp',
        suger_amount: (amountWaterParameter)=>{
            return (parseFloat(amountWaterParameter) * 55) / 1000
        },
        tea_amount: (amountWaterParameter)=>{
            return (parseFloat(amountWaterParameter) * 18) / 1000
        },
        teaType: "ورق ( تلقيمة )",
        teaMixture:"",
        howToPrepare:['يضاف السكر مع الماء على النار إلى أن تصل لدرجة الغليان',"بعد ذوبان السكر نضع الشاي","نغطيه ونتركه لمدة 10 دقائق"],
        teaInWaterTime:"خدرة سريعة",
    },
]

window.addEventListener("DOMContentLoaded",()=>{
    // ===== remove loader spinner on content loaded =====
    loader.style.display =  "none"   
    // =====// remove loader spinner on content loaded //=====

    // ===== search about tea name  =====
    search_about_tea()
    // =====// search about tea name  //=====

    // ===== fill cardes =====
    fill_cards_on_screen(cards)
    // =====// fill cardes //=====

    // ===== fill information in modal =====
    fill_info_on_modal()
    // =====// fill information in modal //=====
    
    document.getElementById('modalTea').addEventListener('hidden.bs.modal', event => {
        document.getElementById('calculate-modal-body').innerHTML = ``
        document.getElementById("calculateAmountWater").value =""
    })
})
        
function explain100ml(){
    alertify.alert(' شرح معنى 100 مللتر بالجرام والمللتر', '<h4>100 مللتر هي تساوي 0.1 لتر، أي أنك تحتاج إلى 10 أكواب من ال100 متللر حتى تصل إلى اللتر الواحد.</h4> <br> <h4>و1000 جرام هي تساوي 1 لتر من الماء.</h4>');
}

function fill_cards_on_screen(x){
    document.getElementById('tea-cards').innerHTML = "";

    x.map((card) => {
        let content = `
            <div class="col-6 col-md-3 mt-3 teaCard" >
                <div class="card " style="cursor: pointer; box-shadow: 0px 6px 7px rgba(0,0,0,0.2);" >
                <h5 class="text-center py-2"> <b>${card.teaMixture? card.teaMixture:"متذوق"}</b> </h5>
                    <hr>
                    <h5 class="text-center">${card.teaInWaterTime}</h5>
                    <hr>
                    <img src="${card.image}" class="card-img-top img-fluid " alt="..." data-card-id = ${card.id} data-bs-toggle="modal" data-bs-target="#modalTea">
                    <hr>
                        
                        <p class="text-center">${card.teaType}</p>
                        <div class="card-body p-2 text-center">
                            <p class="card-text fw-bold">${card.teaName}</p>
                        </div>
                </div>
            </div>
        `
        document.getElementById('tea-cards').innerHTML += content
    })
}

function search_about_tea(){
    // to get write event 
    document.getElementById("search-input").addEventListener("keyup",(event)=>{
        
        // fitler function about some attributes 
        const searchResult = cards.filter((card)=>{
            let searchTeaName = card.teaName.includes(event.target.value);
            let searchTeaType = card.teaType.includes(event.target.value);
            let searchTeaMixture = card.teaMixture.includes(event.target.value);
            return searchTeaName || searchTeaType || searchTeaMixture;
        })
        
        if(searchResult.length <=0){ // if the search is not exisit 
            document.getElementById('tea-cards').innerHTML = `
                <div class="container">
                    <div class="alert alert-warning" role="alert">
                        <h2>لا يوجد نتائج</h2>
                    </div>
                </div>
            ` 
        }
        else{
            fill_cards_on_screen(searchResult)
            fill_info_on_modal()
        }
    })
}

function fill_info_on_modal(){
    for (const i of document.getElementsByClassName("teaCard")) {
        i.addEventListener("click",(event)=>{ // get event to every div has "teaCard" class
            
            const cardId = event.target.getAttribute("data-card-id");
            const clickedCard = cards.find(card => card.id === parseInt(cardId));

            if (clickedCard) {
                document.getElementById('teaTitleModal').innerHTML = `
                    حساب وزنة شاهي ${clickedCard.teaName}
                `   
                
                // ===== calculte amount water and suger and tea =====
                document.getElementById("calculateAmountWater").addEventListener("change",(e)=>{
                    e.preventDefault();
                        
                    let amountWater = parseFloat(e.target.value)
                    if(amountWater <= 0){
                        document.getElementById('calculate-modal-body').innerHTML = `
                            <div class="alert alert-danger" role="alert">
                                الرقم المدخل أصغر من الصفر!
                            </div>
                        `
                    }else{
                        document.getElementById('calculate-modal-body').innerHTML = `
                            <hr>
                            <p>طالما مقدار الماء هو ${e.target.value} مل لتر</p>
                            <p>فإن مقدار السكر ${clickedCard.suger_amount(amountWater).toFixed(2)} جرام ومقدار الورق (التلقيمة) ${clickedCard.tea_amount(amountWater).toFixed(2)} جرام</p>
                            <div>
                                <b>طريقة التحضير:</b>
                                <ul>
                                    ${clickedCard.howToPrepare?.map(p=> `<li>${p}</li>`).join('')}
                                </ul>
                            </div>
                        `  
                    }
                    
                })
                // =====// calculte amount water and suger and tea //=====        
            }
            
            
        })   
    }
}