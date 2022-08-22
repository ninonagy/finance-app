import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import Container from "~/components/Container";
import { createUserSession, login } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const data: any = Object.fromEntries(await request.formData());
  const fields = data;

  const user = await login({
    email: data.email,
    password: data.password,
  });
  if (!user) {
    return json(
      {
        fields,
        errorMessage: `Sorry, we can't find user with the provided credentials. Please check your email and password one more time.`,
      },
      { status: 400 }
    );
  }
  const redirectTo = "/";
  return createUserSession(user.id, redirectTo);
};

export default function Login() {
  const transition = useTransition();
  const actionData = useActionData();

  return (
    <Container>
      <h1 className="text-center">😊 Login to your account</h1>
      <Form method="post" className="w-full">
        <fieldset className="mx-auto max-w-lg">
          <div className="form-control pb-4">
            <label htmlFor="email" className="label">
              <span className="label-text">What's your email?</span>
            </label>
            <input
              className="input input-bordered input-primary"
              defaultValue={actionData?.fields?.email}
              placeholder="Enter your email"
              type="email"
              name="email"
              id="email"
              required
            />
          </div>
          <div className="form-control pb-4">
            <label htmlFor="password" className="label">
              <span className="label-text">Password you use</span>
            </label>
            <input
              className="input input-bordered input-primary"
              placeholder="Enter your password"
              type="password"
              name="password"
              id="password"
              required
            />
          </div>
          {actionData?.errorMessage && (
            <p className="text-error">{actionData.errorMessage}</p>
          )}
          <div className="form-control pt-4">
            <button className="btn btn-primary" type="submit">
              {transition.state === "submitting" ? "Entering..." : "Login 🚀"}
            </button>
          </div>
          <div className="divider"></div>
          <p className="text-center">
            Not having account yet? <Link to="/signup">Sign up</Link> here to
            join.
          </p>
        </fieldset>
      </Form>
    </Container>
  );
}
