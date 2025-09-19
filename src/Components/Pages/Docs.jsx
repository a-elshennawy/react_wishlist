export default function Docs() {
  return (
    <>
      <section className="docs container-fluid row justify-content-center align-items-center m-0 pt-5">
        <h2 className="col-12 px-0 pt-4">
          <strong>welcome to clarity tasks documentations section.</strong>
        </h2>
        <div className="explainSection col-12 px-0 m-0 row justify-content-start align-items-start gap-2">
          <ul className="col-lg-5 col-12">
            <h2 className="py-2 m-0">
              <strong>when it comes to tasks ?</strong>
            </h2>
            <li>
              - adding a task, title is the only required field to create a task
              <p></p>
            </li>
            <li>
              <p>
                - if no date added task will have no due date and so on with
                category
              </p>
            </li>
            <li>
              <p>
                - by clicking on details button you can edit any details about
                the task
              </p>
            </li>
            <li>
              <p>
                - by adding any activity to the task the task will automatically
                be in progress instead of pending
              </p>
            </li>
            <li>
              <p>
                - if due date pass the due date checker will move your task to
                over due section
              </p>
            </li>
            <li>
              <p>
                - by clicking done button will move the task to done tasks
                section and you can still view & edit its details
              </p>
            </li>
          </ul>
          <ul className="col-lg-5 col-12">
            <h3 className="py-2 m-0">
              <strong>what about leaderboard ?</strong>
            </h3>
            <li>
              <p>- each task you submit is +5 point</p>
            </li>
            <li>
              <p>- each completed task is +15 points</p>
            </li>
            <li>
              <p>- each over due task is -2 points</p>
            </li>
            <li>
              <p>- points are updated immediately</p>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
