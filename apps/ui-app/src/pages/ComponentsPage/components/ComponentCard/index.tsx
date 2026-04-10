import { NavLink } from 'react-router';

type ComponentCardProps = {
  name: React.ReactNode;
  url: string;
};

export const ComponentCard = ({ name, url }: ComponentCardProps) => (
  <div>
    <div>
      <NavLink to={url}>{name}</NavLink>
    </div>
  </div>
);
