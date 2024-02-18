const NotificationsPage = () => {
    return (
        <div className="p-5">
            <h1>Notifications</h1>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Website</th>
                        <th scope="col">Text</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>11/26/23</td>
                        <td>apple.com</td>
                        <td>iPhone gift</td>
                    </tr>
                    <tr>
                        <td>11/25/23</td>
                        <td>microcenter</td>
                        <td>New mouse</td>
                    </tr>
                    <tr>
                        <td>11/20/23</td>
                        <td>ticketmaster</td>
                        <td>Hamilton Tickets</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default NotificationsPage;
