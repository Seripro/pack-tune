type Props = {
  title: string;
  start_date: string;
  end_date: string;
  is_completed: boolean;
};

export const TripCard = (props: Props) => {
  const { title, start_date, end_date, is_completed } = props;
  return (
    <>
      <p>{title}</p>
      <p>
        日程：{start_date}〜{end_date}
      </p>
      <p>{is_completed ? "完了" : "未完了"}</p>
    </>
  );
};
