'use client'

import { addTempAction } from "@/action";
import { useActionState } from "react";

type Props = {

}
export default function TempAddForm() {
    const [state, action, pending] = useActionState(addTempAction, "");
    return (
        <>
            <form action={action} className=" flex flex-col w-40 space-y-2 mx-auto">
                <h1 className=" text-2xl">Add new</h1>
                <label htmlFor="name">
                    name:
                    <input required type="text" name="name" id="name" className=" w-40 border-2" />
                </label>
                <label htmlFor="class_and_room">
                    classAndRoom:
                    <input required type="text" name="class_and_room" id="class_and_room" className="w-40 border-2" />
                </label>
                <label htmlFor="order">
                    order:
                    <input required type="number" name="order" id="order" max={7} min={1} className=" w-40 border-2" />
                </label>
                <label htmlFor="execDate">
                    execDate:
                    <input required type="date" name="execDate" id="execDate" className="w-40 border-2" />
                </label>
                <label htmlFor="type">
                    type:
                    {/* <input type="checkbox" name="type" id="type" className=" border-2" /> */}
                    <select name="type" id="type" className="border-2">
                        <option value="true">add</option>
                        <option value="">del</option>
                    </select>
                </label>
                <button type="submit" className=" w-20 border-2">确定</button>
            </form>
            {state}
        </>
    );
}