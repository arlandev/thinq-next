interface accountsPageTitleProps {
  userType?: string;
}

export default function AccountsPageTitle({
  userType,
}: accountsPageTitleProps) {
  return (
    <h1 className="font-main my-10 justify-self-center text-center text-3xl font-bold">
      {userType} ACCOUNTS
    </h1>
  );
}
