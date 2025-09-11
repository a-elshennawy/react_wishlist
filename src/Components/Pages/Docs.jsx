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
            </li>
            <li>
              - if no date added task will have no due date and so on with
              category
            </li>
            <li>
              - by clicking on details button you can edit any details about the
              task
            </li>
            <li>
              - by adding any activity to the task the task will automatically
              be in progress instead of pending
            </li>
            <li>
              - if due date pass the due date checker will move your task to
              over due section
            </li>
            <li>
              - by clicking done button will move the task to done tasks section
              and you can still view & edit its details
            </li>
          </ul>
          <ul className="col-lg-5 col-12">
            <h3 className="py-2 m-0">
              <strong>what about leaderboard ?</strong>
            </h3>
            <li>- each task you submit is +5 point</li>
            <li>- each completed task is +15 points</li>
            <li>- each over due task is -2 points</li>
            <li>- points are updated immediately</li>
          </ul>
        </div>
      </section>
    </>
  );
}
