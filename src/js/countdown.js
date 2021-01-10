
import { $, _await } from "@/js/functions"
import Obj from "@/js/object"

class CountDown {
    constructor({ container, animations, daleys, segments }) {
        this.container = typeof container === 'object' ? container : $.el(container)
        this.animations = animations
        this.daleys = daleys
        this.segments = segments
        this._craetTimet()
    }

    _getFields() {
        const d = this.container.dataset.titels.split('/')
        return {
            days: d[0],
            hours: d[1],
            minutes: d[2],
            seconds: d[3],
        }
    }

    _craetTimet() {

        let date = check.call(this, this._calcStartValue())
        Object.keys(date).forEach(async (key) => {
            this.container.insertAdjacentHTML('beforeEnd', this._renderField(key))
            const el = $.el(`.${key}`, this.container)
            new Obj({
                container: el,
                animation: this.animations[key],
                daley: this.daleys[key],
                segment: this.segments[key]
            })
            await _await(this.daleys[key] + 800)
            $.el(`span[data-value="${key}"]`).innerHTML = date[key]
            $.el(`span[data-field="${key}"]`) && ($.el(`span[data-field="${key}"]`).innerHTML = this._getFields()[key])
        })


        const valueDay = $.el(`span[data-value="days"]`)
        const valueHours = $.el(`span[data-value="hours"]`)
        const valueMinutes = $.el(`span[data-value="minutes"]`)
        const valueSeconds = $.el(`span[data-value="seconds"]`)

        setInterval(() => {
            let date = this._calcStartValue()
            valueDay && (valueDay.innerHTML = date.days)
            valueHours && (valueHours.innerHTML = date.hours)
            valueMinutes && (valueMinutes.innerHTML = date.minutes)
            valueSeconds && (valueSeconds.innerHTML = date.seconds)
        }, 1000)

    }

    _renderField(title) {
        return `
        <div class="filed ${title}" data-${title}>
            <div class="cont">
                <span class="value" data-value="${title}"></span>
                <span class="title" data-field="${title}"></span>
            </div>
        </div> 
        `
    }

    _calcStartValue() {

        const realDate = this.container.dataset.date.split('/')

        for (let i = 0;i <= 5;i++) {
            i === 1 && realDate[i]--
            !realDate[i] && (realDate[i] = 0)
        }

        let date = new Date(...realDate)

        const period = date.getTime() - (new Date().getTime())

        date = {
            days: Math.floor(period / (24 * 60 * 60 * 1000)) >= 0 ? Math.floor(period / (24 * 60 * 60 * 1000)) : 0,
            hours: Math.floor(period / (60 * 60 * 1000)) % 24 >= 0 ? Math.floor(period / (60 * 60 * 1000)) % 24 : 0,
            minutes: Math.floor(period / (60 * 1000)) % 60 >= 0 ? Math.floor(period / (60 * 1000)) % 60 : 0,
            seconds: Math.floor(period / 1000) % 60 >= 0 ? Math.floor(period / 1000) % 60 : 0,
        }

        return date
    }
}


function check(date) {
    let flag = true

    for (const key in date) {
        if (Object.hasOwnProperty.call(date, key)) {
            const el = date[key]
            if (el == 0 && flag) {
                delete date[key]
            } else {
                flag = false
            }
        }
    }

    return date

}

export default CountDown

