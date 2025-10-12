import Footer from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePage } from '@inertiajs/react';

export default function Terms() {
    const { appName } = usePage().props as unknown as { appName: string };
    const { appUrl } = usePage().props as unknown as { appUrl: string };
    const { appEmail } = usePage().props as unknown as { appEmail: string };

    return (
        <>
            <Navbar />
            <main className="xs:pt-20 px-6 pt-16 sm:pt-24 md:px-12 lg:px-24">
                <h1 className="xs:text-4xl mb-12 text-center text-3xl font-bold md:text-5xl">
                    Terms of Use
                </h1>

                <Card className="mb-8 bg-slate-100">
                    <CardHeader>
                        <CardTitle>Version</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Version 1.0</p>
                        <p>
                            These Terms of Use govern your access and use of the{' '}
                            <a
                                href={appUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                {appName}
                            </a>{' '}
                            website. By using the Site, you agree to comply with
                            these Terms and confirm you are at least 18 years
                            old.
                        </p>
                    </CardContent>
                </Card>

                <Card className="mb-8 bg-white">
                    <CardHeader>
                        <CardTitle>Access & Restrictions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            You are granted a limited, non-transferable,
                            non-exclusive license to access the Site for
                            personal, noncommercial use. Certain restrictions
                            apply:
                        </p>
                        <ul className="list-disc space-y-1 pl-5">
                            <li>
                                You may not sell, rent, or commercially exploit
                                the Site.
                            </li>
                            <li>
                                You may not create derivative works or
                                reverse-engineer.
                            </li>
                            <li>
                                You may not copy or redistribute the content
                                without permission.
                            </li>
                            <li>
                                You may not use the Site to build a competitive
                                website.
                            </li>
                        </ul>
                        <p>
                            Company may change, suspend, or cease the Site at
                            any time without liability.
                        </p>
                    </CardContent>
                </Card>

                <Card className="mb-8 bg-white">
                    <CardHeader>
                        <CardTitle>User Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            "User Content" refers to anything you submit to the
                            Site. You are responsible for it and must ensure it
                            complies with the Acceptable Use Policy.
                        </p>
                        <p>
                            By submitting content, you grant {appName} a
                            worldwide, royalty-free license to use it on the
                            Site.
                        </p>
                    </CardContent>
                </Card>

                <Card className="mb-8 bg-white">
                    <CardHeader>
                        <CardTitle>Acceptable Use Policy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            You agree not to use the Site to upload, transmit,
                            or distribute content that:
                        </p>
                        <ul className="list-disc space-y-1 pl-5">
                            <li>
                                Violates any intellectual property or
                                proprietary right
                            </li>
                            <li>
                                Is unlawful, abusive, vulgar, or harmful to
                                minors
                            </li>
                            <li>
                                Contains spam, malware, or unsolicited
                                advertising
                            </li>
                            <li>
                                Attempts to gain unauthorized access to the Site
                            </li>
                        </ul>
                        <p>
                            Company may review and remove User Content or
                            terminate accounts for violations.
                        </p>
                    </CardContent>
                </Card>

                <Card className="mb-8 bg-white">
                    <CardHeader>
                        <CardTitle>Refund & Cancellation Policy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            Refunds may be requested within 14 days of purchase.
                            Approval will be processed within 7-10 business
                            days. Cancellations take effect at the end of the
                            billing cycle. No prorated refunds.
                        </p>
                        <p>
                            Exceptions include user errors or misuse. Company
                            may refuse refund if Terms are violated or fraud is
                            suspected.
                        </p>
                    </CardContent>
                </Card>

                <Card className="mb-8 bg-white">
                    <CardHeader>
                        <CardTitle>Third-Party Links & Ads</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            The Site may include third-party links or ads.{' '}
                            {appName} is not responsible for third-party
                            content. Use at your own risk.
                        </p>
                    </CardContent>
                </Card>

                <Card className="mb-8 bg-white">
                    <CardHeader>
                        <CardTitle>Disclaimers & Limitations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            The Site is provided "as-is". Company disclaims
                            warranties of any kind. Liability is limited to $50.
                            Some jurisdictions may not allow certain
                            limitations.
                        </p>
                    </CardContent>
                </Card>

                <Card className="mb-8 bg-white">
                    <CardHeader>
                        <CardTitle>Arbitration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            Any disputes shall be resolved by binding
                            arbitration, not by courts, unless otherwise
                            specified (e.g., small claims, IP disputes).
                        </p>
                    </CardContent>
                </Card>

                <Card className="mb-8 bg-white">
                    <CardHeader>
                        <CardTitle>Copyright Policy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            Respect intellectual property. Infringing content
                            may be removed, and repeat infringers may be
                            terminated. To report infringement, contact the
                            Company at {appEmail}.
                        </p>
                    </CardContent>
                </Card>

                <Card className="mb-8 bg-white">
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
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
