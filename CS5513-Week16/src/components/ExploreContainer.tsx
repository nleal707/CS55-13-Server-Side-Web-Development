/**
 * Explore Container Component
 * 
 * A generic container component that displays a name and a link to Ionic UI Components
 * documentation. This appears to be a template/placeholder component that may not be
 * actively used in the current application implementation.
 */

import './ExploreContainer.css';

/**
 * Container Props Interface
 * 
 * Defines the props for the ExploreContainer component.
 * 
 * @interface ContainerProps
 * @property {string} name - The name to display in the container
 */
interface ContainerProps {
  name: string;
}

/**
 * ExploreContainer Component
 * 
 * A simple container component that displays a name and a link to Ionic documentation.
 * This component appears to be a template from the Ionic starter template and may
 * not be actively used in the current application.
 * 
 * @component
 * @param {ContainerProps} props - Component props
 * @param {string} props.name - The name to display
 * @returns {JSX.Element} A container div with the name and documentation link
 */
const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <div className="container">
      <strong>{name}</strong>
      <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
    </div>
  );
};

export default ExploreContainer;
