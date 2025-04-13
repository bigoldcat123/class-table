'use client'

import clsx from "clsx";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {

} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
export default function BackButton(props: Props) {
    const router = useRouter()
    function back(): void {
        router.back()
    }
    return (
        <button {...props} className={clsx({'bg-amber-300':!props.className},props.className)} onClick={() => back()}>back</button>
    );
}