import { getJobMarkAction } from "@/action";
import BackButton from "@/components/backButton";
import MarkTable from "@/components/markTable";

type Props = {
    searchParams: Promise<{
        name: string,
        startDate: string,
        endDate: string
    }>
}
export default async function CheckPage(props: Props) {
    const { name, startDate, endDate } = await props.searchParams

    const jobMarks = await getJobMarkAction({ name, startDate, endDate, })
    return (
        <>
            <div><BackButton /></div>
            <div>
                <MarkTable jobMarks={jobMarks} />
            </div>
        </>
    );
}