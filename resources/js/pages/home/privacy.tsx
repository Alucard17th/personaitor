import Footer from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { usePage } from '@inertiajs/react';

export default function Privacy() {
    const { appName } = usePage().props as unknown as { appName: string };
    const { appUrl } = usePage().props as unknown as { appUrl: string };
    const { appEmail } = usePage().props as unknown as { appEmail: string };

    return (
        <>
            <Navbar />
            <main className="xs:pt-20 px-6 pt-16 sm:pt-24 md:px-12 lg:px-24">
                <h1 className="xs:text-4xl mb-12 text-center text-3xl font-bold md:text-5xl">
                    Privacy Policy
                </h1>

                <Card className="mb-8 bg-slate-100">
                    <CardHeader>
                        <CardTitle>Last Updated</CardTitle>
                        <CardDescription>May 16, 2024</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>
                            This Privacy Policy describes Our policies and
                            procedures on the collection, use and disclosure of
                            Your information when You use the Service and tells
                            You about Your privacy rights and how the law
                            protects You.
                        </p>
                        <p>
                            We use Your Personal data to provide and improve the
                            Service. By using the Service, you agree to the
                            collection and use of information in accordance with
                            this Privacy Policy. This Privacy Policy has been
                            created with the help of the{' '}
                            <a
                                href="https://www.termsfeed.com/privacy-policy-generator/"
                                target="_blank"
                                className="text-blue-600 underline"
                                rel="noopener noreferrer"
                            >
                                Privacy Policy Generator
                            </a>
                            .
                        </p>
                    </CardContent>
                </Card>

                <Card className="mb-8 bg-white">
                    <CardHeader>
                        <CardTitle>Definitions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc space-y-1 pl-5">
                            <li>
                                <strong>Account:</strong> A unique account
                                created for You to access our Service.
                            </li>
                            <li>
                                <strong>Affiliate:</strong> An entity that
                                controls, is controlled by, or is under common
                                control with a party.
                            </li>
                            <li>
                                <strong>Company:</strong> {appName} by
                                Noureddine Eddallal.
                            </li>
                            <li>
                                <strong>Cookies:</strong> Small files placed on
                                Your device to track browsing history and
                                improve the Service.
                            </li>
                            <li>
                                <strong>Website:</strong>{' '}
                                <a
                                    href={appUrl}
                                    className="text-blue-600 underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {appName}
                                </a>
                            </li>
                            <li>
                                <strong>You:</strong> The individual or entity
                                accessing or using the Service.
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="mb-8 bg-white">
                    <CardHeader>
                        <CardTitle>Types of Data Collected</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3 className="mt-2 mb-1 font-semibold">
                            Personal Data
                        </h3>
                        <p>
                            Personally identifiable information may include, but
                            is not limited to:
                        </p>
                        <ul className="list-disc space-y-1 pl-5">
                            <li>Email address</li>
                            <li>First name and last name</li>
                            <li>Phone number</li>
                            <li>
                                Address, State, Province, ZIP/Postal code, City
                            </li>
                            <li>Usage Data</li>
                        </ul>

                        <h3 className="mt-4 mb-1 font-semibold">Usage Data</h3>
                        <p>
                            Data collected automatically, such as IP address,
                            browser type, pages visited, time spent, and device
                            information.
                        </p>

                        <h3 className="mt-4 mb-1 font-semibold">
                            Information from Third-Party Services
                        </h3>
                        <p>
                            We may collect information from services like
                            Google, Facebook, Instagram, Twitter, or LinkedIn if
                            you log in using these accounts.
                        </p>
                    </CardContent>
                </Card>

                <Card className="mb-8 bg-white">
                    <CardHeader>
                        <CardTitle>Cookies and Tracking</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            We use cookies and similar tracking technologies to
                            improve user experience. This includes Persistent
                            and Session Cookies, Web Beacons, tags, and scripts.
                        </p>
                        <p>
                            For more details, visit{' '}
                            <a
                                href="https://www.termsfeed.com/blog/cookies/#What_Are_Cookies"
                                className="text-blue-600 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                TermsFeed Cookies Article
                            </a>
                            .
                        </p>
                    </CardContent>
                </Card>

                <Card className="mb-8 bg-white">
                    <CardHeader>
                        <CardTitle>Use of Your Personal Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            Personal Data may be used to provide and maintain
                            the Service, manage your account, contact you with
                            updates, evaluate and improve our services, and for
                            legal compliance.
                        </p>
                    </CardContent>
                </Card>

                <Card className="mb-8 bg-white">
                    <CardHeader>
                        <CardTitle>Contact Us</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Address: Dakhla</p>
                        <p>
                            Email:{' '}
                            <a
                                href={`mailto:${appEmail}`}
                                className="text-blue-600 underline"
                            >
                                {appEmail}
                            </a>
                        </p>
                    </CardContent>
                </Card>

                <Footer />
            </main>
        </>
    );
}
