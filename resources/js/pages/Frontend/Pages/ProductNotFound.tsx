import Wrapper from './Wrapper';

export default function ProductNotFound() {
    return (
        <Wrapper>
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
                <h1 className="text-4xl font-bold text-gray-800">
                    Product Not Found
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                    The product you are looking for does not exist.
                </p>
                <a
                    href="/"
                    className="mt-6 rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
                >
                    Go Back Home
                </a>
            </div>
        </Wrapper>
    );
}
