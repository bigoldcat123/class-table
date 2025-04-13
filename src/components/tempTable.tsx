'use client'
import { deleteTempAction } from "@/action";
import { tempClassTable } from "@/db/schema";

type Props = {
  temps: typeof tempClassTable.$inferSelect[]
}

export default function TempTable({ temps }: Props) {
  const handleDelete = async (id: number) => {
    if (confirm("确认删除?")) {
      await deleteTempAction(id)
    }
  }
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-900">
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b">名称</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b">班级和教室</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b">周几</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b">节次</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b">类型</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b">执行时间</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b">操作</th>
          </tr>
        </thead>
        <tbody className=" divide-y divide-gray-200">
          {temps.map((temp) => (
            <tr key={temp.id} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm ">{temp.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm ">{temp.class_and_room}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm ">{temp.week + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm ">{temp.order + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${temp.type ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {temp.type ? '新增' : '删除'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm ">{new Date(temp.execDate).toDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm "><button onClick={() => handleDelete(temp.id)} className=" bg-red-500 px-2 py-1 rounded-md cursor-pointer">删除</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}