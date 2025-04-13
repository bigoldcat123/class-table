type Props = {
    order: number,
    timeSpan: string
}
export default function ClassOrder(props: Props) {
    return (
        <>
            <div className=" px-2 flex flex-col items-center justify-center border-2">
                <p className=" text-[1.3vw]">{props.order}</p>
                <p className=" text-[1vw]">{props.timeSpan}</p>
            </div>
        </>
    );
}