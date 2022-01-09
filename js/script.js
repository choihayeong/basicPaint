// 
let position = {
    drawable: false,
    x: -1,
    y: -1
};
let penPaint, rectPaint, contextPen, contextRect;
 
penPaint = document.getElementById("pen-paint");
rectPaint = document.getElementById("rect-paint");
contextPen = penPaint.getContext("2d");
contextRect = rectPaint.getContext("2d");

const colorPicker = document.querySelector(".color-picker");
// 색깔 선택
colorPicker.addEventListener("change", event => {
    contextPen.strokeStyle = event.target.value;
    contextRect.strokeStyle = event.target.value;
    // 채우기
    btnFill.addEventListener("click", function() {
        contextPen.fillStyle = event.target.value;
        contextPen.fillRect(0, 0, 700, 700);
        contextRect.fillStyle = event.target.value;
        contextRect.fillRect(0, 0, 700, 700);
    });
});

// 선 두께 선택
const rangePicker = document.querySelector(".range-picker");
const rangeLabel = document.querySelector(".range-label");

rangePicker.addEventListener("input", event => {
    const width = event.target.value;

    rangeLabel.textContent = width;
    contextPen.lineWidth = width;
    contextRect.lineWidth = width;
});

const btnPen = document.querySelector('.btn--pen');
const btnDrawRect = document.querySelector('.btn--draw-rect');
const btnFill = document.querySelector('.btn--fill');
const btnReset = document.querySelector('.btn--reset');
// 리셋 하기
const reset = () => {
    contextPen.clearRect(0,0,penPaint.width, penPaint.height);
    contextRect.clearRect(0,0,rectPaint.width, rectPaint.height);
};
// Pen 그리기
const penDraw = () => {
    contextPen.lineWidth = 1; // 컨버스에 그리는 라인의 두께 설정
    //contextPen.strokeStyle = "#000" // 컨버스에 그리는 라인의 색 설정
    let lineCap = ['butt', 'round', 'square'];
    contextPen.lineCap = lineCap[1];
    const commonListener = (event) => {
        switch(event.type){
            case "mousedown":
                initDraw(event);
                break;
    
            case "mousemove":
                if(position.drawable) //클릭상태인지 확인
                    draw(event);
                break;
    
            case "mouseout":
            case "mouseup":
                finishDraw();
                break;
        }
    }

    penPaint.addEventListener("mousedown", commonListener);
    penPaint.addEventListener("mousemove", commonListener);
    penPaint.addEventListener("mouseup", commonListener);
    penPaint.addEventListener("mouseout", commonListener);

    const initDraw = (event) => {
        contextPen.beginPath(); //새로운 경로 지정
        position.drawable = true;
        var coors = getPosition(event);
        position.X = coors.X;
        position.Y = coors.Y;
        console.log(position.X, position.Y);
        contextPen.moveTo(position.X, position.Y);
    }

    const draw = (event) => {
        var coors = getPosition(event);
        contextPen.lineTo(coors.X, coors.Y);
        position.X = coors.X;
        position.Y = coors.Y;
        contextPen.stroke();
        contextPen.strokeRect(0,0,0,0);
    }

    const finishDraw = () => {
        position.drawable = false;
        position.X = -1;
        position.Y = -1;
    }

    const getPosition = (event) => {
        var x = event.pageX - penPaint.offsetLeft;
        var y = event.pageY - penPaint.offsetTop;
        return {X: x, Y: y};
    }
};
// 사각형 그리기
const drawRect = () => {
    contextRect.lineWidth = 1; // 컨버스에 그리는 라인의 두께 설정
    // contextRect.strokeStyle = "#006cb7" // 컨버스에 그리는 라인의 색 설정
    let drag = false;

    rectPaint.addEventListener ("mousedown", me => {
        mDown (me)
    }, false);
    rectPaint.addEventListener ("mousemove", me => {
        mMove (me)
    }, false);
    rectPaint.addEventListener ("mouseup", me => {
        mUp (me)
    }, false);
    rectPaint.addEventListener ("mouseout", me => {
        mOut (me)
    }, false);


    const mMove = me => {
        //drag가 false 일때는 return(return 아래는 실행 안함)
        if (!drag) {
            return;
        }
        //마우스를 움직일 때마다 X좌표를 nowX에 담음
        var nowX = me.offsetX;
        //마우스를 움직일 때마다 Y좌표를 nowY에 담음
        var nowY = me.offsetY;
        //실질적으로 캔버스에 그림을 그리는 부분
        canvasDraw (nowX,nowY);
        //마우스가 움직일때마다 X좌표를 stX에 담음
        stX = nowX;
        //마우스가 움직일때마다 Y좌표를 stY에 담음
        stY = nowY;
    }

    const mDown = me => {
        startX = me.offsetX;
        startY = me.offsetY;
        stX = me.offsetX; //눌렀을 때 현재 마우스 X좌표를 stX에 담음
        stY = me.offsetY; //눌렀을 때 현재 마우스 Y좌표를 stY에 담음
        drag = true; //그림 그리기는 그리는 상태로 변경
    }

    const mUp = me => {
        endX = me.offsetX
        endY = me.offsetY
        // context.strokeRect(startX,startY,endX-startX,endY-startY)
        drag = false; //마우스를 떼었을 때 그리기 중지
    }
    const mOut = me => drag = false; //마우스가 캔버스 밖으로 벗어났을 때 그리기 중지
    const canvasDraw = (currentX,currentY) => {
        contextRect.clearRect(0,0,rectPaint.width,rectPaint.height) //설정된 영역만큼 캔버스에서 지움
        contextRect.strokeRect(startX,startY,currentX-startX,currentY-startY) //시작점과 끝점의 좌표 정보로 사각형을 그려준다.
    }
};

//채우기
const fillCvs = () => {
    contextPen.fillStyle = "white";
    contextPen.fillRect(0, 0, 700, 700);
    contextRect.fillStyle = "white";
    contextRect.fillRect(0, 0, 700, 700);
}

// Default 상태
penDraw();

btnPen.removeEventListener("click", drawRect);
btnPen.addEventListener("click", penDraw);

btnDrawRect.removeEventListener("click", penDraw);
btnDrawRect.addEventListener("click", drawRect);

btnReset.addEventListener("click", reset);

// btnFill.addEventListener("click", fillCvs);

// 버튼 누르면 active 클래스 줌
let btns = document.querySelectorAll('.btn');
let canvases = document.querySelectorAll('.canvas');

btns.forEach((btn) => {
    let activeData;

    btn.classList.remove('active');
    btn.addEventListener('click', () => {
        btns.forEach((n) => n.classList.remove('active'));
        btn.classList.add('active');

        activeData = btn.getAttribute('data-canvas');
        console.log(activeData);
        canvases.forEach((canvas) => {
            canvas.classList.remove('on');
            if (canvas.getAttribute('data-canvas') === activeData){
                canvas.classList.add('on');
            };
        });
    });
});

// 저장
const saveCvs = () => {
    const img1 = penPaint.toDataURL();
    const dirLink = document.createElement('a');
    dirLink.href = img1;
    dirLink.download = 'paintJS🎨';
    dirLink.click();
}

const btnSave = document.querySelector('.btn--save');

btnSave.addEventListener('click', saveCvs);