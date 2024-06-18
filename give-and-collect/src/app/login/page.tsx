import Login from "@/components/Login/Login"

type Props = {
    searchParams: Record<"callbackUrl"|"error", string>;
};

const LoginPage = (props: Props) => {
    return (
        <Login 
            callbackUrl={props.searchParams?.callbackUrl} 
            error={props.searchParams?.error} 
        />
    );
};

export default LoginPage;