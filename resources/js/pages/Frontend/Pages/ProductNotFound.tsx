import Wrapper from './Wrapper';

export default function ProductNotFound() {
    return (
        <Wrapper>
            <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950">
                <h1 className="text-4xl font-extrabold text-white uppercase">
                    Product Not Found
                </h1>
                <p className="mt-4 text-lg text-neutral-400">
                    The product you are looking for does not exist.
                </p>
                <a
                    href="/"
                    className="mt-6 rounded bg-lime-400 px-4 py-2 font-bold text-black uppercase transition hover:bg-lime-300"
                >
                    Go Back Home
                </a>
            </div>
        </Wrapper>
    );
}
