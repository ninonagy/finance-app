import { ActionFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { z } from "zod";
import { zfd } from "zod-form-data";
import Container from "~/components/Container";
import db from "~/db/prisma/client";
import { createUserSession, register } from "~/utils/session.server";

// const SignupFormSchema = zfd.formData({
//   email: zfd.text(
//     z.string({ required_error: "Email is required" }).email("Invalid email")
//   ),
//   password: zfd.text(
//     z
//       .string({ required_error: "Password is required" })
//       .min(8, "Password must be at least 8 characters")
//   ),
//   // passwordConfirm: zfd.text(
//   //   z
//   //     .string({ required_error: "Password confirmation is required" })
//   //     .min(8, "Password must be at least 8 characters")
//   // ),
// });

export const action: ActionFunction = async ({ request }) => {
  const data: any = Object.fromEntries(await request.formData());
  const fields = data;

  if (data.password !== data.passwordConfirm) {
    return json(
      {
        fields,
        errorMessage: "Password confirmation does not match.",
      },
      { status: 400 }
    );
  }
  if (data.password.length < 8) {
    return json(
      {
        fields,
        errorMessage: "Password must be at least 8 characters.",
      },
      { status: 400 }
    );
  }

  const userExists = await db.user.findFirst({ where: { email: data.email } });
  if (userExists) {
    return json(
      {
        fields,
        errorMessage: `Sorry, it looks like this email is already in use. Please try another one.`,
      },
      { status: 400 }
    );
  }
  const user = await register({ email: data.email, password: data.password });
  if (!user) {
    return json(
      {
        fields,
        errorMessage: `Something went wrong trying to create a new user. Please try again.`,
      },
      { status: 400 }
    );
  }
  const redirectTo = "/";
  return createUserSession(user.id, redirectTo);
};

export default function Signup() {
  const actionData = useActionData();

  return (
    <Container>
      <h1 className="text-center">👋 Join our app</h1>
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
              <span className="label-text">Type password you'll use</span>
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
          <div className="form-control pb-4">
            <label htmlFor="password" className="label">
              <span className="label-text">
                Please enter same password again, just to be sure
              </span>
            </label>
            <input
              className="input input-bordered input-primary"
              placeholder="Type same password again"
              type="password"
              name="passwordConfirm"
              id="passwordConfirm"
              required
            />
          </div>
          {actionData?.errorMessage && (
            <p className="text-error">{actionData.errorMessage}</p>
          )}
          <div className="form-control pt-4">
            <button className="btn btn-primary" type="submit">
              Create account
            </button>
          </div>
          <div className="divider"></div>
          <p className="text-center">
            Already have an account? Go to <Link to="/login">log in</Link>{" "}
            screen.
          </p>
        </fieldset>
      </Form>
    </Container>
  );
}
