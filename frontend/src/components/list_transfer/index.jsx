import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios'


function ListTransfer() {
    const [tran, setTran] = useState([])

    const getTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:3000/transactions')
            // console.log(response.data)
            setTran(response.data);

        } catch (error) {
            const message = error?.response?.data?.error || 'Server error'
            showToast(message, 'danger')
        }
    }

    //delete function
    // const deleteTodo = async (id) => {
    //     try {
    //         const deleteTodo = await fetch(`http://localhost:3000/todos/${id}`, {
    //             method: "DELETE"
    //         })
    //         setTodos(todos.filter(todo => todo.todo_id!==id))
    //     } catch (error) {
    //         console.log(error.message)
    //     }
    // }

    useEffect(() => {
        getTransactions();
    }, [])

    return (
        <Fragment>
            <table className="table mt-5 text-center">
                <thead>
                    <tr>
                        <th scope="col">From Account</th>
                        <th scope="col">To Account</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Status</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {tran.map(t => (
                        <tr key={t.tid}>
                            <td>{t.from_account_name}</td>
                            <td>{t.to_account_name}</td>
                            <td>{t.amount}</td>
                            <td>{t.status}</td>
                            {/* <td><EditTodo todo={todo} /></td> */}
                            <td>
                                {/* <button className="btn btn-danger" onClick={() => deleteTodo(todo.todo_id)}>Delete</button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Fragment>
    )
}

export default ListTransfer
