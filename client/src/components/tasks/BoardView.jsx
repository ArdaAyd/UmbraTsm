import TaskCard from "./TaskCard";

const BoardView = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return <div className="text-center text-gray-500 py-8">Hiç görev bulunamadı.</div>;
  }
  return (
    <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10'>
      {tasks?.map((task, index) => (
        <TaskCard task={task} key={index} />
      ))}
    </div>
  );
};

export default BoardView;
