'use client'

import { useRouter, useSearchParams } from "next/navigation";
import React, { FormEvent, useEffect } from "react";

type Props = {

}
export default function MarkQueryHeader(props: Props) {
    const router = useRouter();

    useSearchParamsDefault()

    function handleSubbmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get("name")?.toString();
        const startDate = formData.get("startDate")?.toString();
        const endDate = formData.get("endDate")?.toString();
        const params = new URLSearchParams();
        if (name) {
            params.append("name", name);
        }
        if (startDate) {
            params.append("startDate", startDate);
        }
        if (endDate) {
            params.append("endDate", endDate);
        }
        router.replace("/check-in?" + params.toString());
    }

    return (
        <>
            <form onSubmit={handleSubbmit} className=" flex space-x-3">
                <label htmlFor="name">
                    课程名:
                    <input className=" border-2 py-2 rounded-2xl px-1" type="text" id="name" name="name" placeholder="课程名称..." />
                </label>
                <label htmlFor="startDate">
                    开始日期:
                    <input className=" border-2 py-2 rounded-2xl px-1" type="date" id="startDate" name="startDate" />
                </label>
                <label htmlFor="endDate">
                    结束日期:
                    <input className=" border-2 py-2 rounded-2xl px-1" type="date" id="endDate" name="endDate" />
                </label>
                <button className=" border-2 py-2 rounded-2xl px-5" type="submit">查询</button>
            </form>
        </>
    );
}
const useSearchParamsDefault = () => {
    const search = useSearchParams()
    useEffect(() => {
        const name = search.get("name");
        const startDate = search.get("startDate");
        const endDate = search.get("endDate");
        if (name) {
            (document.getElementById("name") as HTMLInputElement).value = name;
        }
        if (startDate) {
            (document.getElementById("startDate") as HTMLInputElement).value = startDate;
        }
        if (endDate) {
            (document.getElementById("endDate") as HTMLInputElement).value = endDate;
        }
    }, [search])
}