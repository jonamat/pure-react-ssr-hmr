import React, { FC, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import fetch from 'cross-fetch';
import World from '../../assets/img/world.png';
import Logo from '../../assets/img/ssr.svg';
import { Defer } from 'react-wait-content';

declare global {
    interface Window {
        /* Data passed to the client by server */
        data?: any;
    }
}

const ResultCell: FC<{ result: boolean }> = ({ result }) => (
    <td className={result ? 'test passed' : 'test failed'}>{result ? 'passed' : 'failed'}</td>
);

const tests: Array<FC> = [
    () => {
        // Check if SCSS has been correctly transpiled and injected
        function runTest() {
            const cssRules = Array.from(document.styleSheets[0].cssRules);
            return cssRules.some((rule) => (rule as any).selectorText === '#test-scss');
        }

        return (
            <Defer trigger="pageLoaded" fallback={<tr></tr>}>
                <tr>
                    <td>SCSS transpiled and styles loaded</td>
                    <ResultCell result={runTest()} />
                    <td></td>
                </tr>
            </Defer>
        );
    },
    () => {
        // Check if static resources are being correctly served
        const ref = useRef<any>();
        const [testResult, setTestResult] = useState<boolean>(false);

        const checkTimer = setInterval(() => {
            const img = ref.current;
            if (img && img.complete && !!img.naturalHeight) {
                setTestResult(true);
                clearInterval(checkTimer);
            }
        }, 300);

        return (
            <tr>
                <td>PNG fetched from server</td>
                <ResultCell result={testResult} />
                <td>
                    <img ref={ref} src={World} />
                </td>
            </tr>
        );
    },
    () => {
        // Check if SVGs are being correctly injected inline
        const [testResult, setTestResult] = useState<boolean>(false);
        const ref = useRef<any>();
        const svgString =
            '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 400 400" xml:space="preserve"><g id="react-svg-orbital" fill="#61dafb"><path d="M396.5 198.5c0-26-32.6-50.7-82.6-66 11.5-50.9 6.4-91.5-16.2-104.4-5.2-3-11.3-4.5-17.9-4.5v17.9c3.7 0 6.6.7 9.1 2.1 10.9 6.3 15.6 30 11.9 60.6-.9 7.5-2.3 15.5-4.1 23.6-15.7-3.8-32.8-6.8-50.9-8.7-10.8-14.8-22-28.3-33.3-40 26.1-24.3 50.6-37.6 67.3-37.6v-18c-22 0-50.9 15.7-80 42.9-29.1-27.1-58-42.6-80-42.6v17.9c16.6 0 41.2 13.2 67.3 37.3-11.2 11.8-22.4 25.2-33.1 40-18.1 1.9-35.2 4.9-50.9 8.8-1.8-8-3.2-15.8-4.2-23.2-3.8-30.6.9-54.4 11.7-60.7 2.4-1.4 5.5-2.1 9.2-2.1V23.9c-6.7 0-12.8 1.4-18.1 4.5-22.5 13-27.6 53.4-15.9 104.2C36 148 3.6 172.6 3.6 198.5c0 26 32.6 50.7 82.6 66-11.5 50.9-6.4 91.5 16.2 104.4 5.2 3 11.3 4.5 18 4.5 22 0 50.9-15.7 80-42.9 29.1 27.1 58 42.6 80 42.6 6.7 0 12.8-1.4 18.1-4.5 22.5-13 27.5-53.4 15.9-104.2 49.7-15.3 82.1-40 82.1-65.9zm-104.3-53.4c-3 10.3-6.6 21-10.8 31.6-3.3-6.4-6.7-12.8-10.5-19.2-3.7-6.4-7.6-12.6-11.5-18.7 11.4 1.6 22.3 3.7 32.8 6.3zm-36.6 85.3c-6.3 10.8-12.6 21.1-19.3 30.6-11.9 1-24 1.6-36.2 1.6-12.1 0-24.2-.6-36-1.5-6.6-9.5-13.1-19.7-19.4-30.4-6.1-10.5-11.6-21.1-16.7-31.9 5-10.7 10.6-21.5 16.6-31.9 6.3-10.8 12.6-21.1 19.3-30.6 11.9-1 24-1.6 36.2-1.6 12.1 0 24.2.6 36 1.5 6.6 9.5 13.1 19.7 19.4 30.4 6.1 10.5 11.6 21.1 16.7 31.9-5.1 10.6-10.6 21.4-16.6 31.9zm25.8-10.5c4.3 10.7 8 21.5 11 31.9-10.5 2.6-21.5 4.7-33 6.4 3.9-6.2 7.9-12.5 11.5-19 3.8-6.4 7.2-12.9 10.5-19.3zm-81.3 85.5c-7.4-7.7-14.9-16.3-22.3-25.6 7.2.3 14.6.6 22 .6 7.5 0 15-.2 22.3-.6-7.2 9.3-14.5 17.9-22 25.6zm-59.5-47.2c-11.4-1.7-22.3-3.8-32.8-6.3 3-10.3 6.7-21 10.8-31.6 3.3 6.4 6.7 12.8 10.5 19.2 3.7 6.4 7.5 12.6 11.5 18.7zm59.2-166.6c7.4 7.7 14.9 16.3 22.3 25.6-7.2-.3-14.6-.6-22-.6-7.5 0-15 .2-22.3.6 7.1-9.4 14.5-17.9 22-25.6zm-59.2 47.1c-3.9 6.2-7.9 12.5-11.5 19-3.7 6.4-7.1 12.8-10.4 19.2-4.3-10.7-8-21.5-11.1-31.9 10.3-2.4 21.5-4.6 33-6.3zM68.1 239c-28.3-12.1-46.7-27.9-46.7-40.5S39.6 170 68.1 158c6.9-3 14.4-5.6 22.2-8.1 4.6 15.7 10.6 32 18 48.8-7.4 16.7-13.3 32.9-17.8 48.5-7.9-2.5-15.6-5.2-22.4-8.2zm43 114.4c-10.9-6.3-15.6-30-11.9-60.6.9-7.5 2.3-15.5 4.1-23.5 15.7 3.8 32.8 6.8 50.8 8.7 10.8 14.8 22 28.3 33.3 40-26.1 24.3-50.6 37.6-67.3 37.6-3.5-.1-6.5-.8-9-2.2zm190-61c3.8 30.6-.9 54.4-11.7 60.7-2.4 1.4-5.5 2.1-9.2 2.1-16.6 0-41.2-13.2-67.3-37.3 11.2-11.8 22.4-25.1 33.1-40 18.1-1.9 35.2-4.9 50.9-8.8 1.9 8.1 3.3 15.9 4.2 23.3zM332 239c-6.9 3-14.4 5.6-22.2 8.1-4.6-15.7-10.6-32-18-48.8 7.4-16.7 13.3-32.9 17.8-48.5 7.9 2.5 15.5 5.2 22.5 8.2 28.4 12.1 46.7 27.9 46.7 40.5-.2 12.5-18.5 28.5-46.8 40.5z"></path><circle cx="199.9" cy="198.5" r="36.6"></circle></g><path d="M163.8 366.7c6.6 0 15.2-6 16.6-13.1 2.3-11.8-12.2-13.4-19.9-16.5-13.6-5.4-24-18.3-20.6-35.9 4.2-21.8 24-39.3 44.3-39.3 18.5 0 31 14.7 29.7 33.9l-25.1 5.5c1.4-7-3-13-9.6-13-6.7 0-13.4 6-14.7 13.1-2.2 11.6 10.8 14.7 18.7 17.4 14.3 4.7 25.2 17.1 21.7 35.1-4.2 21.8-25.9 39.3-46 39.3-18.6 0-32.6-14.6-31.6-33.9l25.1-5.5c-1.4 7.1 4.7 13 11.4 12.9zM246 366.7c6.6 0 15.2-6 16.6-13.1 2.3-11.8-12.2-13.4-19.9-16.5-13.6-5.4-24-18.3-20.6-35.9 4.2-21.8 24-39.3 44.3-39.3 18.5 0 31 14.7 29.7 33.9l-25.1 5.5c1.4-7-3-13-9.6-13-6.7 0-13.4 6-14.7 13.1-2.2 11.6 10.8 14.7 18.7 17.4 14.3 4.7 25.2 17.1 21.7 35.1-4.2 21.8-25.9 39.3-46 39.3-18.6 0-32.6-14.6-31.6-33.9l25.1-5.5c-1.4 7.1 4.7 13 11.4 12.9zM314.8 263H354c13.4 0 23.1 5.5 28.8 13.1 5.8 7.9 8.7 15 5.9 29.3l-.6 3.4c-1.7 8.7-5.9 16.9-12.4 24.6-5.5 6.3-9.3 9-16.7 11.9l18.8 46.8h-29.5L325.1 335 314 392.1h-24.1L314.8 263zm49 43.2c.9-4.7.2-8.8-2.3-12.4-2.5-3.3-8-5.1-13.9-5.1H334l-6.9 35.6h9.3v.1h8c8.8 0 17.4-8.3 19.4-18.2z"></path></svg>';

        useEffect(() => {
            if (ref.current?.innerHTML.toString() === svgString) setTestResult(true);
        }, []);

        return (
            <tr>
                <td>Inline SVG rendering</td>
                <ResultCell result={testResult} />
                <td ref={ref}>
                    <Logo />
                </td>
            </tr>
        );
    },
    () => {
        // Check if the client bundle has been correctly fetched and evaluated
        const [count, setCount] = useState<number>(0);
        const timer = setTimeout(() => setCount(count + 1), 1000);

        useEffect(() => () => clearTimeout(timer));

        return (
            <tr>
                <td>Client bundle is running</td>
                <ResultCell result={!!count} />
                <td>Current count [{count}]</td>
            </tr>
        );
    },
    () => {
        // Check if the server made a http request and successfully sent it to the client
        return (
            <tr>
                <td>Test fetching from server</td>
                <ResultCell result={!!window.data?.countryName} />
                <td>{`Fetched resource: ${window.data?.countryName} (server location)`}</td>
            </tr>
        );
    },
    () => {
        // Check cross-fetch from client
        const [ip, setIp] = useState<string | null>(null);

        useEffect(() => {
            fetch('https://json.geoiplookup.io')
                .then((res) => res.json())
                .then(({ ip }) => setIp(ip))
                .catch(({ message }) => {
                    setIp(null);
                    console.error(message);
                });
        }, []);

        return (
            <tr>
                <td>Test fetching from client</td>
                <ResultCell result={!!ip} />
                <td>{!!ip ? `Fetched resource: ${ip} (your IP)` : null}</td>
            </tr>
        );
    },
    () => {
        // Check if dotenv vars has been loaded
        return (
            <tr>
                <td>Dotenv vars </td>
                <ResultCell result={!!process.env.TEST_VAR} />
                <td>process.env.TEST_VAR={process.env.TEST_VAR}</td>
            </tr>
        );
    },
    () => {
        // Check if fonts has been loaded and rendered
        const [result, setResult] = useState(false);

        (document as any).fonts.ready.then(() => {
            setResult((document as any).fonts.check('1em Montserrat'));
        });

        return (
            <tr>
                <td>Local fonts loaded</td>
                <ResultCell result={result} />
                <td className="font-loading-test">
                    <span className="fw400">weight 400</span> - <span className="fw500"> weight 500</span>
                    {' - '}
                    <span className="fw600">weight 600</span>
                </td>
            </tr>
        );
    },
    () => {
        // Open a link via direct server request
        return (
            <tr>
                <td>Test routing via server</td>
                <td>
                    <a href="/router-test">Start test</a>
                </td>
                <td></td>
            </tr>
        );
    },
    () => {
        // Open a link via React Router (the page should be loaded from client)
        return (
            <tr>
                <td>Test routing via client</td>
                <td>
                    <Link to="/router-test">Start test</Link>
                </td>
                <td></td>
            </tr>
        );
    },
    () => {
        // Check redirection via server request
        return (
            <tr>
                <td>Test redirect via server</td>
                <td>
                    <a href="/redirect-test">Start test</a>
                </td>
                <td></td>
            </tr>
        );
    },
    () => {
        // Check redirection via react-router
        return (
            <tr>
                <td>Test redirect via client</td>
                <td>
                    <Link to="/redirect-test">Start test</Link>
                </td>
                <td></td>
            </tr>
        );
    },
];

export default tests;
