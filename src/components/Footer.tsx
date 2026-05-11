import { NavLink } from "react-router-dom";

export const Footer = () => {
  return (
    <div style={{ position: "fixed", bottom: 0, width: "100%" }}>
      <NavLink to="/trips">旅行一覧</NavLink>
      <NavLink to="/items/stats">スタッツ</NavLink>
    </div>
  );
};
