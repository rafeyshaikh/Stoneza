import react from 'react';
const LoginLayout = ({ children }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#eae8e2]">
            {children}
        </div>
    );
};
export default LoginLayout;