<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Google Login Success</title>
</head>
<body>
<script>
    // Get the plan ID from the backend
    const planId = "{{ $planId ?? '' }}";

    if (window.opener) {
        // Send a message back to the opener window
        window.opener.postMessage({
            type: 'google-login-success',
            checkoutPlanId: planId
        }, window.location.origin);

        // Close this popup
        window.close();
    }
</script>
<p>Logging in…</p>
</body>
</html>
