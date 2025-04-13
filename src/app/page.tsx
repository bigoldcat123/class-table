import { getClassTable } from "@/action";
import ClassTable from "@/components/classTable";
import Link from "next/link";
// import '@libsql/darwin-arm64'

type Props = {
  searchParams: Promise<{
    next: string
  }>
}
export default async function Home(props: Props) {
  const { next } = await props.searchParams
  const date = new Date();
  if (next) {
    date.setDate(date.getDate() + 7);
  }
  const classes = await getClassTable(date)
  return (
    <>
      <div>
        <Link className=" px-2 py-1 " href={"/temp"}>临时安排</Link>
        {next ? <Link className=" px-2 py-1 " href={"/"}>返回～</Link> : <Link className=" px-2 py-1 " href={"/?next=1"}>查看下周课表</Link>}
        <Link className=" px-2 py-1 " href={"/check-in"}>打卡记录～</Link>
      </div>
      <ClassTable classes={classes} />
    </>
  );
}