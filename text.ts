import {z} from 'zod'
const s = z.coerce.date()

let d = "4/13/2025"
const date = s.parse(d)
    console.log(date);