import { Card, Divider, Grid, Paper, Typography } from "@mui/material";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import DeleteIcon from '@mui/icons-material/Delete';

interface FoodCollectionInfoProps {
  data: FoodCollection;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function FoodCollectionInfo(props: FoodCollectionInfoProps) {
  return (
    <Grid container spacing={1} component={Paper} elevation={3} sx={{ padding: "10px" }}>
      <Grid size={12} sx={{ padding: "10px" }}>
        <Typography variant="h4">{props.data.name}</Typography>
        <Divider variant="middle" />
      </Grid>
      <Grid container size={6} sx={{ padding: "10px" }}>
        <Grid size={12}>
          <Typography variant="h5">Calories</Typography>
        </Grid>
        <Grid size={12}>
          {props.data.calories} <Typography variant="caption">kcal/100g</Typography>
        </Grid>
      </Grid>
      <Grid container size={6} sx={{ padding: "10px" }}>
        <Grid size={12}>
          <Typography variant="h5">Portion weight</Typography>
        </Grid>
        <Grid size={12}>
          {props.data.portion_weight} <Typography variant="caption">g</Typography>
        </Grid>
      </Grid>
      <Grid size={12} sx={{ padding: "10px" }}>
        <Divider variant="middle" />
      </Grid>
      <Grid container size={4} sx={{ padding: "10px" }}>
        <Grid size={12}>
          <Typography variant="h5">Fat</Typography>
        </Grid>
        <Grid size={12}>
          {props.data.fats} <Typography variant="caption">g/100g</Typography>
        </Grid>
      </Grid>
      <Grid container size={4} sx={{ padding: "10px" }}>
        <Grid size={12}>
          <Typography variant="h5">Carbs</Typography>
        </Grid>
        <Grid size={12}>
          {props.data.carbs} <Typography variant="caption">g/100g</Typography>
        </Grid>
      </Grid>
      <Grid container size={4} sx={{ padding: "10px" }}>
        <Grid size={12}>
          <Typography variant="h5">Protein</Typography>
        </Grid>
        <Grid size={12}>
          {props.data.protein} <Typography variant="caption">g/100g</Typography>
        </Grid>
      </Grid>
      <Grid size={12} sx={{ padding: "10px" }}>
        <Divider variant="middle" />
      </Grid>
      {(props.onDelete || props.onEdit) && (
        <Grid container size={12} sx={{ padding: "10px", alignItems: "center" }}>
          {props.onEdit && (
            <Grid size={"grow"}>
              <EditSquareIcon color="info" onClick={props.onEdit}/>
            </Grid>
          )}
          {props.onDelete && (
            <Grid size={"grow"}>
              <DeleteIcon color="error" onClick={props.onDelete} />
            </Grid>
          )}
        </Grid>
      )}
      <Grid size={12} sx={{ padding: "10px" }}>
        <Divider variant="middle" />
      </Grid>
      {props.data.ingredients?.map((ingredient) => 
      <Grid key={ingredient.food_item_id} size={12}>
        <Card variant="outlined">
          <Typography variant="h6">{ingredient.amount}g of {ingredient.food_item.name}</Typography>
        </Card>
      </Grid>)
      }
      
    </Grid>
  );
}
