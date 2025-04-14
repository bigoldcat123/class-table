
import { getTempAction } from "@/action";
import BackButton from "@/components/backButton";
import TempAddForm from "@/components/tempAddForm";
import TempTable from "@/components/tempTable";


export const dynamic = 'force-dynamic'

type Props = {

}
export default async function AddTempPage() {
    const temps = await getTempAction()
    return (
        <>
            <BackButton />
            <div className=" flex">
                <div className=" flex-3">
                    <TempTable temps={temps}/>
                </div>
                <div className=" flex-1">
                    <TempAddForm />
                </div>

            </div>
        </>
    );
}
