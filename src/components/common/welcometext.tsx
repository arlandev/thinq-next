interface welcomeTextProps {
    firstName: string;
    lastName: string;
  }
  
  export default function WelcomeText({firstName, lastName}: welcomeTextProps) {
    return (
        <h2 className="text-xl">
          Welcome, <b>{firstName} {lastName}</b>
        </h2>
      );
  }