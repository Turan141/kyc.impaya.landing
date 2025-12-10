import { useEffect, useRef } from "react"
import { styled } from "styled-components"

export interface IChartDataItem{
    name:string,
    color?:string,
    values:number[],
    bars:string[]
}

export type IChartData = IChartDataItem[]

const CanvasEl = styled.canvas`
    
`

export const LineChart = ({data}:{data:IChartData})=>{
    const canvsaRef = useRef<HTMLCanvasElement|null>(null)
    useEffect(()=>{
        
        const canvas = canvsaRef.current
        const context = canvas?.getContext('2d')
        if(!canvas || !context) return

        if(context){
            context.clearRect(0,0,canvas.width,canvas.height)
            context.fillStyle = 'rgba(0,0,0,.3)'
            context.fillRect(0,0,canvas.width,canvas.height)

           // draw grid
            context.strokeStyle = 'rgba(0,0,0,.4)'
            context.lineWidth = 1
            context.beginPath()
            const step = 20
            for(let i=0;i<canvas.height;i+=step){
                context.moveTo(0,i)
                context.lineTo(canvas.width,i)
            }
            for(let i=0;i<canvas.width;i+=step){
                context.moveTo(i,0)
                context.lineTo(i,canvas.height)
            }
            context.stroke()
            context.closePath()

            
           
            let m = 0;
            for(let char of data){
                 //const { values, bars } = resampleData(data[0].values, data[0].bars ?? [], canvas.width);
                const values = char.values;
                const bottomPadding = 20;
                let space=4;
                let spaceSize = (values.length-1) * space;
                let barWidth = (canvas.width-spaceSize)/values.length;
                
                let drawBarWidth = barWidth/data.length;
                
                
                

                if(barWidth<1){
                    space = 0;
                    barWidth = 1;
                }
            
                //const minValue = Math.min(...values);
                const maxValue = Math.max(...values);
                
                let nextX=0;
                for(let i=0;i<values.length;i++){
                    const value = values[i]
                    //const nextValue = values[i+1];

                    let height = Math.ceil((value * (canvas.height-bottomPadding))/maxValue)

                    
                    if(height<1 || isNaN(height))
                        height=1;


                    

                    //context.fillStyle = char.color || 'white';
                    // gradient
                    context.fillStyle = context.createLinearGradient(0,0,0,canvas.height);
                    
                    /*context.fillStyle.addColorStop(0,"#ff4800");
                    context.fillStyle.addColorStop(1,"#6600ff");*/
                    
                    context.fillStyle.addColorStop(0,"#3bc51f");
                    context.fillStyle.addColorStop(1,"#b7ff00");

                    context.beginPath();
                    context.roundRect(nextX+(drawBarWidth*m),canvas.height-height - bottomPadding,drawBarWidth,height,[2,2,0,0])
                    context.fill();
                    context.closePath();
                    nextX += barWidth+space;
                }
                m++;
            }

        }

    },[data])

    return <CanvasEl width="500px" ref={canvsaRef}/>
}


//@ts-ignore
function resampleData(data: number[], bars: string[], targetWidth: number): { values: number[], bars: string[] } {
    const sourceLength = data.length;

    if (sourceLength !== bars.length && bars.length !== 0) {
        throw new Error("Длина data и bars должна совпадать");
    }

    // 🔻 Если данных больше, чем ширина canvas → уменьшаем (усредняем)
    if (sourceLength > targetWidth) {
        const bucketSize = sourceLength / targetWidth;
        const downsampledData: number[] = [];
        const downsampledBars: string[] = [];

        for (let i = 0; i < targetWidth; i++) {
            const start = Math.floor(i * bucketSize);
            const end = Math.min(Math.floor((i + 1) * bucketSize), sourceLength);
            const slice = data.slice(start, end);
            downsampledData.push(slice.reduce((sum, val) => sum + val, 0) / slice.length);
            if(bars && bars.length > 0)
                downsampledBars.push(bars[start]); // Берем первую подпись из группы
        }

        return { values: downsampledData, bars: downsampledBars };
    }

    // 🔺 Если данных меньше, чем ширина canvas → увеличиваем (интерполируем)
    if (sourceLength < targetWidth) {
        const interpolatedData: number[] = [];
        const interpolatedBars: string[] = [];

        for (let i = 0; i < targetWidth; i++) {
            const x = (i / (targetWidth - 1)) * (sourceLength - 1);
            const x0 = Math.floor(x);
            const x1 = Math.min(Math.ceil(x), sourceLength - 1);
            const y0 = data[x0];
            const y1 = data[x1];
            interpolatedData.push(y0 + (y1 - y0) * (x - x0)); // Линейная интерполяция
            if(bars && bars.length > 0)
                interpolatedBars.push(bars[x0]); // Просто копируем ближайшую подпись
        }

        return { values: interpolatedData, bars: interpolatedBars };
    }

    // Если длины совпадают, просто возвращаем исходные массивы
    return { values:data, bars };
}



// AI DRAW
//@ts-ignore
function test  (){
    /*for (let i of data) {
        const { values, bars } = resampleData(i.values, i.bars ?? [], canvas.width);
        const stepX = canvas.width / (values.length - 1);
        
        // 🔹 Определяем максимальное и минимальное значение для нормализации
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const padding = 20; // Отступ снизу для подписей
        const stepY = (canvas.height - padding) / (maxValue - minValue || 1);

        // 🔹 Рисуем сглаженный график
        context.beginPath();
        context.strokeStyle = i.color || 'white';
        context.lineWidth = 2;
        context.moveTo(0, canvas.height - (values[0] - minValue) * stepY - padding);

        for (let j = 1; j < values.length - 1; j++) {
            const xc = (j * stepX + (j + 1) * stepX) / 2; // Средняя точка X
            const yc = canvas.height - ((values[j] - minValue) * stepY) - padding; // Средняя точка Y
            context.quadraticCurveTo(j * stepX, yc, xc, yc); // Создание плавного изгиба
        }

        // Последняя линия до финальной точки
        context.lineTo(canvas.width, canvas.height - (values[values.length - 1] - minValue) * stepY - padding);
        context.stroke();

        // 🔹 Рисуем подписи оси X (bars)
        if (bars) {
            context.fillStyle = 'white';
            context.font = "12px Arial";
            context.textAlign = "center";

            const labelStep = Math.ceil(bars.length / 10); // Подпись каждые 10 точек

            for (let j = 0; j < bars.length; j += labelStep) {
                context.fillText(bars[j], j * stepX, canvas.height - 5); // Подпись внизу оси X
            }
        }
    }*/
}