export class $ {
    static el = (val, cont = document) => cont.querySelector(val)
    static all = (val, cont = document) => cont.querySelectorAll(val)
}

export const _await = (time) =>
    new Promise((res) => {
        setTimeout(() => res(), time)
    })