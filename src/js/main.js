import 'normalize.css'
import '@/scss/style.scss'

import { $ } from "@/js/functions"
import Obj from "@/js/object"

import days from 'anim/1.json'
import hours from 'anim/2.json'
import minutes from 'anim/3.json'
import seconds from 'anim/4.json'


new Obj({
  container: '.days',
  animation: days,
  type : "days",
  segment: [43, 150]
})
new Obj({
  container: '.hours',
  animation: hours,
  type : "hours",
  daley: 99,
  segment: [20, 150]
})
new Obj({
  container: '.minutes',
  animation: minutes,
  type : "minutes",
  daley: 233,
  segment: [43, 150]
})
new Obj({
  container: '.seconds',
  animation: seconds,
  daley: 399,
  type : "seconds",
  segment: [43, 150]
})

