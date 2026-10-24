import pool from "@/lib/db";
export async function POST(request: Request){
    const body = await request.json();
      const { amount } = body;

      await pool.query(
        "INSERT INTO income (amount) VALUES (?)",
        [amount]
      );

    console.log("Income:", amount)

    return Response.json({
        message: "Income added successfully",
    })
}

export async function GET(){
    try{
        const [rows] = await pool.query(
            "SELECT * FROM income ORDER BY created_at DESC"
        );

            return Response.json({
                success:true,
                data:rows,
            });
    }catch (error){
        console.error(error);

        return Response.json(
            {
                success:false,
                message:"Failed to fetch income",
            },
            {status: 500}
        );
    }

    
}